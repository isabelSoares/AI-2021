import {Category,CategoryLogger,CategoryServiceFactory,CategoryConfiguration,LogLevel} from "typescript-logging";

CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));

export function create_root_category(category_name : string) : Category {
    return new Category(category_name);
}

export function create_category(category_name : string, parent_category : Category) : Category {
    return new Category(category_name, parent_category);
}