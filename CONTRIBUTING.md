# Contributing

## Development

Easiest way to develop GitHub Actions is through tests.

1. Modify the code as needed.

2. Execute the test after tweaking input.

```
npm run test
```

## Deployment

1. Update the version in package.json.

2. Package the code in a bundle

```
npm run build && npm run package
```

3. Commit, tag and push the bundle within the repository

> note: It might feel a bit odd to commit the bundle. The way it works
> is that GitHub fetches each action in a workflow. All dependencies
> should be present which is why we bundle them beforehand.
