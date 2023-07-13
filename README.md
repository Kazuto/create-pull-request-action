# Create Pull Request Action

This action creates or updates a pull request in your repository.

Example:
Your development branch is `develop` and your release branch is `master`.

On merging a pull request into `develop` the following pull request is either created or updated:
`develop -> master`

On merging a pull request into `master` the following pull request is either created or updated:
`master -> develop`

These pull request are updated with the latest pull requests merged to the target branch.
