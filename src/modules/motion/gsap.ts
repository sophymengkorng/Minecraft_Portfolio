import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * The one place plugins are registered. Client components import GSAP from
 * here, so every plugin is registered before any of them use it.
 */
gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, useGSAP);

export { gsap, ScrollTrigger, SplitText, useGSAP };
