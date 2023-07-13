import { getInput } from '@actions/core'
import { getOctokit, context } from '@actions/github'
import { Endpoints } from '@octokit/types'

type listPullRequestParameters =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['parameters']
type listPullRequestResponse =
  Endpoints['GET /repos/{owner}/{repo}/pulls']['response']

const { rest } = getOctokit(getInput('github-token'))

const headBranch: string = getInput('head-branch')
const baseBranch: string = getInput('base-branch')

run()

async function run() {
  const pullRequests = await findPullRequests()

  console.log(pullRequests)
}

const queryData: listPullRequestParameters = {
  ...context.repo,
  head: headBranch,
  base: baseBranch,
}

async function findPullRequests(): Promise<listPullRequestResponse | null> {
  return await rest.pulls.list(queryData)
}
