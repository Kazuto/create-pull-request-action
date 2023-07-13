import { queryData, pullRequestTitle, bodyToAppend } from './useUtilities'
import { getInput } from '@actions/core'
import { getOctokit } from '@actions/github'
import { Endpoints } from '@octokit/types'

type listPullRequestResponse =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['response']['data'][0]

type postPullRequestParameters =
  Endpoints['POST /repos/{owner}/{repo}/pulls']['parameters']

type updatePullRequestParameters =
  Endpoints['PATCH /repos/{owner}/{repo}/pulls/{pull_number}']['parameters']

const { rest } = getOctokit(getInput('github-token'))

export const findPullRequest =
  async (): Promise<listPullRequestResponse | null> => {
    const response = await rest.pulls.list(queryData)

    if (response?.data === null || response.data.length === 0) {
      return null
    }

    const pullRequest = response.data.find((pr) =>
      pr.title.includes(pullRequestTitle())
    )

    return pullRequest ?? null
  }

export const createPullRequest = async () => {
  const date = new Date().toLocaleDateString('us', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const title = `${pullRequestTitle()} \`${date}\``

  const body =
    '_This PR was automatically created by an action._\n' +
    '## Downtime \n' +
    '## Pull Requests' +
    bodyToAppend()

  await rest.pulls.create(<postPullRequestParameters>{
    ...queryData,
    title,
    body,
    draft: true,
  })
}

export const updatePullRequest = async (
  pullRequest: listPullRequestResponse
) => {
  const body = pullRequest.body ?? '' + bodyToAppend()

  await rest.pulls.update(<updatePullRequestParameters>{
    ...queryData,
    body,
    pull_number: pullRequest.number,
  })
}
