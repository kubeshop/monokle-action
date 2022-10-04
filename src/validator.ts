import {
  KubernetesSchemaValidator,
  LabelsValidator,
  MonokleValidator,
  ResourceLinksValidator,
  ResourceParser,
  SchemaLoader,
  YamlValidator,
} from "@monokle/validation";

export function createValidator() {
  const parser = new ResourceParser();
  const labelsValidator = new LabelsValidator(parser);
  const yamlValidator = new YamlValidator(parser);

  const schemaLoader = new SchemaLoader();
  const schemaValidator = new KubernetesSchemaValidator(parser, schemaLoader);

  const resourceLinksValidator = new ResourceLinksValidator();

  const validator = new MonokleValidator([
    labelsValidator,
    yamlValidator,
    schemaValidator,
    resourceLinksValidator,
  ]);

  return validator;
}

export function configureValidator(validator: MonokleValidator) {
  return validator.configure([
    {
      tool: "labels",
      enabled: true,
    },
    {
      tool: "yaml-syntax",
      enabled: true,
    },
    {
      tool: "resource-links",
      enabled: true,
    },
    {
      tool: "kubernetes-schema",
      enabled: true,
      schemaVersion: "1.24.2",
    },
  ]);
}
