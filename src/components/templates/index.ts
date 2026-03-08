import { TemplateMinimal } from './Minimal'
import { TemplateModern } from './Modern'
import { TemplateExecutive } from './Executive'
import { TemplateCreative } from './Creative'
import { TemplateTech } from './Tech'
import { TemplateClassic } from './Classic'
import { TemplateVibrant } from './Vibrant'
import { TemplateElegant } from './Elegant'
import { TemplateStartup } from './Startup'
import { TemplateAcademic } from './Academic'

export const Templates = {
    minimal: TemplateMinimal,
    modern: TemplateModern,
    executive: TemplateExecutive,
    creative: TemplateCreative,
    tech: TemplateTech,
    classic: TemplateClassic,
    vibrant: TemplateVibrant,
    elegant: TemplateElegant,
    startup: TemplateStartup,
    academic: TemplateAcademic
};

export type TemplateId = keyof typeof Templates;
export const TEMPLATE_IDS = Object.keys(Templates) as TemplateId[];
