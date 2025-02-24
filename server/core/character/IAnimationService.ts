import { Animation } from "./impl/Animation";
import { AnimationCategory } from "./impl/AnimationCategory";

export type IAnimationService = {
    load: () => void;
    getAnimationById: (id: number) => Animation | undefined;
    getAnimations: () => Animation[];

    getCategoryById: (id: number) => AnimationCategory | undefined;
    getCategories: () => AnimationCategory[];
};