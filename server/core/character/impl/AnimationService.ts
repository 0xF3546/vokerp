import { dataSource } from "@server/data/database/app-data-source";
import { IAnimationService } from "../IAnimationService";
import { Animation } from "./Animation";
import { AnimationCategory } from "./AnimationCategory";

export class AnimationService implements IAnimationService {
    private animationRepository = dataSource.getRepository(Animation);
    private categoryRepository = dataSource.getRepository(AnimationCategory);
    private animations: Animation[] = [];
    private categories: AnimationCategory[] = [];

    load() {
        this.animationRepository.find().then(animations => {
            this.animations = animations;
            console.log(`${animations.length} Animationen wurden geladen.`);
        });

        this.categoryRepository.find().then(categories => {
            this.categories = categories;
            console.log(`${categories.length} Kategorien wurden geladen.`);
        });
    }

    getAnimationById(id: number): Animation | undefined {
        return this.animations.find(animation => animation.id === id);
    }

    getAnimations(): Animation[] {
        return this.animations;
    }

    getCategoryById(id: number): AnimationCategory | undefined {
        return this.categories.find(category => category.id === id);
    }

    getCategories(): AnimationCategory[] {
        return this.categories;
    }
}

let animationService: IAnimationService;

export const animationServiceInitializer = {
    load: () => {
        animationService = new AnimationService();
        animationService.load();
    }
}

export function getAnimationService(): IAnimationService {
    if (!animationService) {
        animationService = new AnimationService();
    }
    return animationService;
}