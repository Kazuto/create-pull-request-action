const capitalize = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

const getQueryData = (context) => {
  const { REPO_HEAD: head, REPO_BASE: base } = process.env
  const { owner, repo } = context.repo

  return { owner, repo, head, base }
}

const getPullRequestTitle = (data) => {
  return `${capitalize(data.head)} -> ${capitalize(data.base)}`
}

const findPullRequest = async (github, context) => {
  const data = getQueryData(context)

  const response = await github.rest.pulls.list(data)

  if (response?.data === null || response.data.length === 0) {
    return null
  }

  return response.data.find((pr) =>
    pr.title.includes(getPullRequestTitle(data))
  )
}

const getBodyToAppend = (pullRequest) => {
  return `\n- #${pullRequest.number} by @${pullRequest.user.login}`
}

const createPullRequest = async (github, context) => {
  const data = getQueryData(context)

  const date = new Date().toLocaleDateString('us', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const title = `${getPullRequestTitle(data)} \`${date}\``

  const body =
    '_This PR was automatically created by an action._\n' +
    '## Downtime \n' +
    '## Pull Requests' +
    getBodyToAppend(context.payload.pull_request)

  await github.rest.pulls.create({
    ...data,
    title,
    body,
    draft: true,
  })
}

const updatePullRequest = async (github, context, pullRequest) => {
  const data = getQueryData(context)

  const body = pullRequest.body + getBodyToAppend(context.payload.pull_request)

  await github.rest.pulls.update({
    ...data,
    body,
    pull_number: pullRequest.number,
  })
}

module.exports = async ({ github, context }) => {
  if (!context.payload.pull_request.merged) {
    return
  }

  const pullRequest = await findPullRequest(github, context)

  if (pullRequest === null) {
    await createPullRequest(github, context)

    return
  }

  await updatePullRequest(github, context, pullRequest)
}
