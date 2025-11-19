# plataforma-mantencion

[![CI](https://github.com/GonzaloOrellanaC/plataforma-mantencion/actions/workflows/ci.yml/badge.svg)](https://github.com/GonzaloOrellanaC/plataforma-mantencion/actions/workflows/ci.yml)
[![E2E Tests](https://github.com/GonzaloOrellanaC/plataforma-mantencion/actions/workflows/e2e.yml/badge.svg)](https://github.com/GonzaloOrellanaC/plataforma-mantencion/actions/workflows/e2e.yml)
[![Codecov](https://codecov.io/gh/GonzaloOrellanaC/plataforma-mantencion/branch/main/graph/badge.svg)](https://codecov.io/gh/GonzaloOrellanaC/plataforma-mantencion)

This repository contains the SGM backend and related packages.

Coverage notes:

- The CI workflow generates a coverage report for the `apps/api` project and uploads it as an artifact.
- The workflow also attempts to upload coverage to Codecov using the `CODECOV_TOKEN` secret. If your repository is private, set the `CODECOV_TOKEN` secret in GitHub repository settings (Actions > Secrets) to enable upload. For public repositories, Codecov may accept anonymous uploads.

E2E workflow (manual)

- The end-to-end tests run via a manual workflow `E2E Tests` (file: `.github/workflows/e2e.yml`).
- To run e2e tests on GitHub: go to Actions → E2E Tests → Run workflow, choose branch and click "Run workflow".
- Badge: [E2E Tests](https://github.com/GonzaloOrellanaC/plataforma-mantencion/actions/workflows/e2e.yml)

Run via GitHub CLI (recommended for maintainers)

- Prerequisites: install the GitHub CLI (`gh`) and authenticate (`gh auth login`).
- To dispatch the E2E workflow from your terminal (default branch `main`):

```bash
gh workflow run e2e.yml --repo GonzaloOrellanaC/plataforma-mantencion --ref main
```

- Or with PowerShell:

```powershell
gh workflow run e2e.yml --repo GonzaloOrellanaC/plataforma-mantencion --ref main
```

- Helper scripts are available in `scripts/`:
	- `scripts/run-e2e.sh` (POSIX/macOS/Linux)
	- `scripts/run-e2e.ps1` (Windows PowerShell)

Example (Linux/macOS):

```bash
./scripts/run-e2e.sh main
```

Example (Windows PowerShell):

```powershell
.\scripts\run-e2e.ps1 -ref main
```

# SgmMonorepo

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ Your new, shiny [Nx workspace](https://nx.dev) is ready ✨.

Run `npx nx graph` to visually explore what got created. Now, let's get you up to speed!

## Run tasks

To run tasks with Nx use:

```sh
npx nx <target> <project-name>
```

For example:

```sh
npx nx build myproject
```

These targets are either [inferred automatically](https://nx.dev/concepts/inferred-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) or defined in the `project.json` or `package.json` files.

[More about running tasks in the docs &raquo;](https://nx.dev/features/run-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Add new projects

While you could add new projects to your workspace manually, you might want to leverage [Nx plugins](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) and their [code generation](https://nx.dev/features/generate-code?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) feature.

To install a new plugin you can use the `nx add` command. Here's an example of adding the React plugin:
```sh
npx nx add @nx/react
```

Use the plugin's generator to create new projects. For example, to create a new React app or library:

```sh
# Generate an app
npx nx g @nx/react:app demo

# Generate a library
npx nx g @nx/react:lib some-lib
```

You can use `npx nx list` to get a list of installed plugins. Then, run `npx nx list <plugin-name>` to learn about more specific capabilities of a particular plugin. Alternatively, [install Nx Console](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) to browse plugins and generators in your IDE.

[Learn more about Nx plugins &raquo;](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) | [Browse the plugin registry &raquo;](https://nx.dev/plugin-registry?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Set up CI!

### Step 1

To connect to Nx Cloud, run the following command:

```sh
npx nx connect
```

Connecting to Nx Cloud ensures a [fast and scalable CI](https://nx.dev/ci/intro/why-nx-cloud?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects) pipeline. It includes features such as:

- [Remote caching](https://nx.dev/ci/features/remote-cache?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task distribution across multiple machines](https://nx.dev/ci/features/distribute-task-execution?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Automated e2e test splitting](https://nx.dev/ci/features/split-e2e-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Task flakiness detection and rerunning](https://nx.dev/ci/features/flaky-tasks?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

### Step 2

Use the following command to configure a CI workflow for your workspace:

```sh
npx nx g ci-workflow
```

[Learn more about Nx on CI](https://nx.dev/ci/intro/ci-with-nx#ready-get-started-with-your-provider?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Install Nx Console

Nx Console is an editor extension that enriches your developer experience. It lets you run tasks, generate code, and improves code autocompletion in your IDE. It is available for VSCode and IntelliJ.

[Install Nx Console &raquo;](https://nx.dev/getting-started/editor-setup?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

## Useful links

Learn more:

- [Learn about Nx on CI](https://nx.dev/ci/intro/ci-with-nx?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [Releasing Packages with Nx release](https://nx.dev/features/manage-releases?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
- [What are Nx plugins?](https://nx.dev/concepts/nx-plugins?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)

And join the Nx community:
- [Discord](https://go.nx.dev/community)
- [Follow us on X](https://twitter.com/nxdevtools) or [LinkedIn](https://www.linkedin.com/company/nrwl)
- [Our Youtube channel](https://www.youtube.com/@nxdevtools)
- [Our blog](https://nx.dev/blog?utm_source=nx_project&utm_medium=readme&utm_campaign=nx_projects)
