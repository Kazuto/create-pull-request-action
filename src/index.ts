import {
  findPullRequest,
  createPullRequest,
  updatePullRequest,
} from './composables/useOctokit'

findPullRequest().then(async (pullRequest) => {
  if (pullRequest === null) {
    await createPullRequest()

    return
  }

  await updatePullRequest(pullRequest)
})
