<p align="center">
  <img src="docs/images/large-icon-256.png" alt="Monokle Logo" width="128" height="128"/>
</p>

<p align="center">
<a href="https://github.com/features/actions">Monokle Action</a>
for <a href="">static Kubernetes analysis</a>.
</p>

<p align="center">
  <a href="https://github.com/kubeshop/monokle-action/releases">
    <img title="Release" src="https://img.shields.io/github/v/release/kubeshop/monokle-action"/>
  </a>

  <a href="https://github.com/kubeshop/monokle-core/tree/main/packages/validation">
    <img title="mit licence" src="https://img.shields.io/badge/License-MIT-yellow.svg"/>
  </a>
</p>

## Welcome to Monokle Action

Monokle Action is a GitHub Action for static analysis of Kubernetes resources.

Use it to prevent misconfigurations within Kustomize, Helm or default Kubernetes resources. The output is available as a SARIF file which you can upload to GitHub CodeScan.

Under the hood it uses [@monokle/validation][monokle-validation] which allows you to configure validation rules extensively.

[Explore a demo pull request][demo-pr]

## Table of content

- [Welcome to Monokle Action](#welcome-to-monokle-action)
- [Table of content](#table-of-content)
- [Usage](#usage)
  - [Validate the output of Kustomize](#validate-the-output-of-kustomize)
  - [Validate the output of Helm](#validate-the-output-of-helm)
  - [Validate default Kubernetes resources](#validate-default-kubernetes-resources)
  - [Validate and upload to GitHub CodeScan](#validate-and-upload-to-github-codescan)
- [Configuration](#configuration)
  - [Action inputs](#action-inputs)
  - [@monokle/validation rules](#monoklevalidation-rules)

## Usage

### Validate the output of Kustomize

```yaml
on: push

jobs:
  validate:
    name: Validate Kustomize with Monokle
    runs-on: ubuntu-latest
    steps:
      - id: checkout
        uses: actions/checkout@master
      - id: bake
        uses: azure/k8s-bake@v2.2
        with:
          renderEngine: "kustomize"
          kustomizationPath: "./kustomize-happy-cms/overlays/local"
      - id: validate
        uses: kubeshop/monokle-action@v0.2.0
        with:
          path: ${{ steps.bake.outputs.manifestsBundle }}
```

### Validate the output of Helm

```yaml
on: push

jobs:
  validate:
    name: Validate Helm with Monokle
    runs-on: ubuntu-latest
    steps:
      - id: checkout
        uses: actions/checkout@master
      - id: bake
        uses: azure/k8s-bake@v2.2
        with:
          renderEngine: "helm"
          helmChart: "./helm-yellow-wordpress"
      - id: validate
        uses: kubeshop/monokle-action@v0.2.0
        with:
          path: ${{ steps.bake.outputs.manifestsBundle }}
```

### Validate default Kubernetes resources

```yaml
on: push

jobs:
  validate:
    name: Validate Kubernetes resources with Monokle
    runs-on: ubuntu-latest
    steps:
      - id: checkout
        uses: actions/checkout@master
      - id: validate
        uses: kubeshop/monokle-action@v0.2.0
        with:
          path: __path_to_file_or_directory_with_kubernetes_yaml_files__
```

### Validate and upload to GitHub CodeScan

```yaml
on: push

jobs:
  validate:
    runs-on: ubuntu-latest
    permissions:
      security-events: write
    name: Validate Kustomize with Monokle
    steps:
      - id: checkout
        uses: actions/checkout@master
      - id: bake
        uses: azure/k8s-bake@v2.2
        with:
          renderEngine: "kustomize"
          kustomizationPath: "./kustomize-happy-cms/overlays/local"
      - id: validate
        uses: kubeshop/monokle-action@v0.2.0
        with:
          path: ${{ steps.bake.outputs.manifestsBundle }}
      - id: upload-sarif
        if: always()
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: ${{ steps.validate.outputs.sarif }}
```

## Configuration

### Action inputs

**[path]** Relative path to a directory or a YAML file with Kubernetes resources.

**[config]** Relative path to the Monokle validation configuration file.

### @monokle/validation rules

The Monokle Action looks for a Monokle Validation configuration.

The default path is found at `./monokle.validation.yaml`.

[Learn more about Monokle Validation configuration][monokle-validation-docs]

**Example**

```yaml
plugins:
  yaml-syntax: true
  kubernetes-schema: true
rules:
  yaml-syntax/no-bad-alias: "warn"
  yaml-syntax/no-bad-directive: false
  open-policy-agent/no-last-image: "err"
  open-policy-agent/cpu-limit: "err"
  open-policy-agent/memory-limit: "err"
  open-policy-agent/memory-request: "err"
settings:
  kubernetes-schema:
    schemaVersion: v1.24.2
```

[monokle-validation]: https://github.com/kubeshop/monokle-core/tree/main/packages/validation
[monokle-validation-docs]: https://github.com/kubeshop/monokle-core/blob/main/packages/validation/docs/configuration.md
[demo-pr]: https://github.com/kubeshop/monokle-demo/pull/1
