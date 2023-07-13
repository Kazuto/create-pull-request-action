import { context } from '@actions/github'
import { getInput } from '@actions/core'
import { Endpoints } from '@octokit/types'

type listPullRequestParameters =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['parameters']

const capitalize = (string: string | undefined): string | null => {
  if (string === undefined) {
    return null
  }

  return string.charAt(0).toUpperCase() + string.slice(1)
}

export const queryData: listPullRequestParameters = {
  ...context.repo,
  head: getInput('head-branch'),
  base: getInput('base-branch'),
}

export const pullRequestTitle = (): string => {
  return `${capitalize(queryData.head)} -> ${capitalize(queryData.base)}`
}

export const bodyToAppend = (): string => {
  const pullRequest = context.payload.pull_request ?? null

  if (pullRequest === null) {
    return ''
  }

  return `\n- #${pullRequest.number} by @${pullRequest.user.login}`
}
