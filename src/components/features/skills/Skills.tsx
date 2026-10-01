import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SECTION_IDS } from "@/modules/portfolio/constants";
import { SECTION_COPY, SKILL_GROUPS } from "@/modules/portfolio/content";
import { skillIcon } from "@/modules/portfolio/skillIcons";
import styles from "./Skills.module.css";

const ALL_SKILLS = [...new Set(SKILL_GROUPS.flatMap((group) => group.items))];

/** "Spring Boot" → "SB", "Laravel" → "La" — only for a skill with no logo. */
function itemGlyph(name: string): string {
  const words = name.split(/[\s.]+/).filter(Boolean);
  if (words.length > 1) return words.slice(0, 2).map((word) => word[0]?.toUpperCase()).join("");
  return name.slice(0, 2).replace(/^./, (first) => first.toUpperCase());
}

/** `--n` staggers the float, so no two items bob in step. */
type FloatStyle = React.CSSProperties & { "--n": number };
const floatPhase = (item: string): FloatStyle => ({ "--n": ALL_SKILLS.indexOf(item) });

/**
 * The item in a slot: the skill's real logo, floating like a dropped item,
 * over a small shadow that shrinks as it rises. Decorative — the name is
 * always written beside it or announced elsewhere.
 */
function ItemLogo({ name }: { name: string }) {
  const icon = skillIcon(name);

  return (
    <span className={styles.icon} aria-hidden="true">
      {icon ? (
        <svg className={styles.logo} viewBox="0 0 24 24" fill={icon.color}>
          <path d={icon.path} />
        </svg>
      ) : (
        <span className={`${styles.logo} ${styles.glyph}`}>{itemGlyph(name)}</span>
      )}
      <span className={styles.shadow} />
    </span>
  );
}

/**
 * A hotbar of every skill. Scrolling through the section moves the selected
 * slot, the way the mouse wheel does in the game, and the item's name pops up
 * above it; hovering a slot selects it too (`data-hotbar` in MotionDirector).
 * Decorative — the inventory below lists the same names for everyone — so it
 * is hidden from screen readers. Without JS or with reduced motion it rests on
 * the first slot.
 */
function Hotbar() {
  return (
    <div className={styles.hotbar} data-hotbar aria-hidden="true">
      <p className={styles.hotbarName} data-hotbar-name>
        {ALL_SKILLS[0]}
      </p>
      <ol className={styles.hotbarSlots}>
        {ALL_SKILLS.map((item, index) => (
          <li
            key={item}
            className={styles.hotbarSlot}
            data-hotbar-slot={item}
            data-selected={index === 0 ? "" : undefined}
            style={floatPhase(item)}
          >
            <ItemLogo name={item} />
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * The skills as a hotbar, then an inventory: one row of slots per group inside
 * a GUI panel. Slots pop in one after another as the panel arrives
 * (`data-pop`), like items being picked up.
 * Every slot shows its name; hovering adds the in-game tooltip, which is
 * decorative (it repeats the name and group), so it is hidden from readers.
 */
export function Skills() {
  return (
    <Section id={SECTION_IDS.skills} copy={SECTION_COPY.skills}>
      <Container>
        <Hotbar />
        <div className={styles.inventory} data-reveal>
          {SKILL_GROUPS.map((group) => (
            <div key={group.heading} className={styles.group}>
              <h3 className={styles.heading}>{group.heading}</h3>
              <ul className={styles.slots}>
                {group.items.map((item) => (
                  <li
                    key={item}
                    className={styles.slot}
                    style={floatPhase(item)}
                    data-pop
                  >
                    <ItemLogo name={item} />
                    <span className={styles.name}>{item}</span>
                    <span className={styles.tooltip} aria-hidden="true">
                      {item}
                      <span className={styles.tooltipGroup}>{group.heading}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
