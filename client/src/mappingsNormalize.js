// V2 List Controls returns top-level frameworkTags on each control.
// Example:
// control.frameworkTags = ["SOC_2","ISO27001",...]
//
// Some detailed responses MAY also include requirements[],
// but list usually doesn't. We'll support both safely.

export function extractMappingsFromV2Control(control) {
  const tags = Array.isArray(control?.frameworkTags)
    ? control.frameworkTags
    : [];

  const reqs = Array.isArray(control?.requirements)
    ? control.requirements
    : [];

  const requirements = reqs
    .map(r => r?.name)
    .filter(Boolean);

  return {
    rawFrameworkTags: tags,
    rawRequirements: reqs,
    frameworksText: tags.join(", "),
    requirementsText: requirements.join(", ")
  };
}