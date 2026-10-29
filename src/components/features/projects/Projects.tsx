import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { ArrowUpRightIcon } from "@/components/ui/Icons";
import { Section } from "@/components/ui/Section";
import { getProjects } from "@/modules/portfolio/api";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import {
  FEATURED_PROJECT_TOAST,
  PROJECT_TOAST,
  PROJECTS_EMPTY,
  SECTION_COPY,
} from "@/modules/portfolio/content";
import {
  CARD_MAX_TAGS,
  COLLAPSED_COUNT,
  FILTER_MIN_PROJECTS,
  splitFeatured,
  stackFilters,
  tagsAttribute,
} from "@/modules/portfolio/projects";
import type { Project } from "@/modules/portfolio/types";
import styles from "./Projects.module.css";

type Variant = "spotlight" | "compact";

/**
 * The projects, as published in the console (`getProjects`), in the order
 * arranged there. Featured ones lead as wide spotlights; the rest fill a
 * denser grid. With enough projects a stack filter appears above them, and
 * the grid folds after `COLLAPSED_COUNT` behind a "Show all" button.
 *
 * Everything is server-rendered and complete without JS: every card shows and
 * the toolbar stays `hidden`. The filter, the fold and their Flip animation
 * are the `[data-projects]` effect in MotionDirector — the cards never
 * re-mount, so the scroll-in and scramble effects bound to them survive.
 * Following a card's link or its source link is counted in the console
 * (`ProjectClickTracker`).
 */
export async function Projects() {
  const projects = await getProjects();
  const { spotlight, grid } = splitFeatured(projects);
  const filters = projects.length >= FILTER_MIN_PROJECTS ? stackFilters(projects) : [];
  const folds = grid.length > COLLAPSED_COUNT;

  return (
    <Section id={SECTION_IDS.projects} copy={SECTION_COPY.projects}>
      <Container>
        {projects.length === 0 ? (
          <p className={styles.empty}>{PROJECTS_EMPTY}</p>
        ) : (
          <div className={styles.projects} data-projects data-collapsed-count={COLLAPSED_COUNT}>
            {(filters.length > 0 || folds) && (
              <div className={styles.toolbar} data-projects-toolbar hidden>
                {filters.length > 0 && (
                  <div className={styles.filters} role="group" aria-label="Filter projects by stack">
                    <button type="button" className={styles.chip} data-filter="" aria-pressed="true">
                      All <span className={styles.count}>{projects.length}</span>
                    </button>
                    {filters.map((filter) => (
                      <button
                        key={filter.key}
                        type="button"
                        className={styles.chip}
                        data-filter={filter.key}
                        aria-pressed="false"
                      >
                        {filter.label} <span className={styles.count}>{filter.count}</span>
                      </button>
                    ))}
                  </div>
                )}
                <p className={styles.status} data-projects-status role="status">
                  {projects.length} projects
                </p>
              </div>
            )}

            {spotlight.length > 0 && (
              <ol className={styles.spotlights}>
                {spotlight.map((project) => (
                  <li key={project.slug} className={styles.item} data-project data-tags={tagsAttribute(project)}>
                    <div className={styles.shell} data-project-reveal>
                      <ProjectCard project={project} variant="spotlight" />
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {grid.length > 0 && (
              <ol className={styles.grid}>
                {grid.map((project, position) => (
                  <li
                    key={project.slug}
                    className={styles.item}
                    data-project
                    data-tags={tagsAttribute(project)}
                    data-extra={position >= COLLAPSED_COUNT || undefined}
                  >
                    <div className={styles.shell} data-project-reveal>
                      <ProjectCard project={project} variant="compact" />
                    </div>
                  </li>
                ))}
              </ol>
            )}

            {folds && (
              <div className={styles.more} data-projects-more hidden>
                <button type="button" className={styles.moreButton}>
                  Show all {grid.length} projects
                </button>
              </div>
            )}
          </div>
        )}
      </Container>
    </Section>
  );
}

/** `https://www.example.com/x` → `example.com`, for the window's title bar. */
function hostOf(href: string | null): string | null {
  if (!href) return null;
  try {
    return new URL(href).host.replace(/^www\./, "");
  } catch {
    return null;
  }
}

/**
 * One project: its cover screenshot in a little browser window, then an
 * advancement toast. The name is the card's link and stretches over the whole
 * card, so the card is one click target and one tab stop; a repo link, when
 * the card already points at the live site, is layered above that stretch —
 * a second anchor can't nest inside the first. Names decode as they enter and
 * again on hover (`data-scramble` inside `data-scramble-row`). The
 * screenshot is walled in by stone blocks that break away as it scrolls in,
 * and a selection wave ripples from the pointer on hover (`data-blocks`, the
 * number of columns).
 */
function ProjectCard({ project, variant }: { project: Project; variant: Variant }) {
  const linked = project.href !== null;
  const host = hostOf(project.href);
  const spotlight = variant === "spotlight";
  const tags = spotlight ? project.stack : project.stack.slice(0, CARD_MAX_TAGS);
  const hiddenTags = project.stack.length - tags.length;

  return (
    <article
      className={`${styles.card} ${styles[variant]}`}
      data-linked={linked || undefined}
      data-featured={project.featured || undefined}
      data-project-slug={project.slug}
      data-scramble-row
    >
      <a
        className={styles.mediaLink}
        href={project.href ?? undefined}
        {...(linked ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        aria-label={linked ? `Open ${project.name} live project` : undefined}
      >
      <div className={styles.media} aria-hidden="true">
        <span className={styles.chrome}>
          <span className={styles.dots} />
          <span className={styles.host}>{host ?? project.slug}</span>
        </span>
        <span className={styles.shot}>
          {project.coverUrl ? (
            <Image
              src={project.coverUrl}
              alt=""
              fill
              loading={project.index === "01" ? "eager" : "lazy"}
              sizes={
                spotlight
                  ? "(max-width: 900px) 100vw, 60vw"
                  : "(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
              }
            />
          ) : (
            <span className={styles.placeholder}>{project.index}</span>
          )}
        </span>
        <span className={styles.frame}>{project.index}</span>
      </div>
      </a>

      <div className={styles.body}>
        <span className={styles.toast} aria-hidden="true">
          {project.featured ? FEATURED_PROJECT_TOAST : PROJECT_TOAST}
        </span>
        <h3 className={styles.name}>
          {linked ? (
            <a
              className={styles.link}
              href={project.href!}
              data-project-link={project.hrefLink ?? undefined}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span data-scramble>{project.name}</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ) : (
            <span data-scramble>{project.name}</span>
          )}
        </h3>
        {project.description && (
          <p className={styles.description}>{project.description}</p>
        )}
        {project.stack.length > 0 && (
          <p className={styles.stack}>
            <span className="sr-only">Built with: </span>
            {tags.map((tech) => (
              <span key={tech} className={styles.tag}>
                {tech}
              </span>
            ))}
            {hiddenTags > 0 && (
              <span className={styles.tag} title={project.stack.slice(tags.length).join(", ")}>
                <span aria-hidden="true">+{hiddenTags}</span>
                <span className="sr-only">{project.stack.slice(tags.length).join(", ")}</span>
              </span>
            )}
          </p>
        )}
        {(linked || project.repoHref) && (
          <span className={styles.actions}>
            {linked && (
              <span className={styles.visit} aria-hidden="true">
                Visit
                <ArrowUpRightIcon />
              </span>
            )}
            {project.repoHref && (
              <a
                className={styles.source}
                href={project.repoHref}
                data-project-link="repo"
                target="_blank"
                rel="noopener noreferrer"
              >
                Source
                <span className="sr-only"> code for {project.name} (opens in a new tab)</span>
              </a>
            )}
          </span>
        )}
      </div>
    </article>
  );
}
