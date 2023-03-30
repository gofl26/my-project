// plugins/pocketbase.js
import PocketBase from 'pocketbase'

export default async (ctx, inject) => {
  const pb = new PocketBase('http://127.0.0.1:8090')
  //   console.log(ctx.req?.headers?.cookie)
//   console.log(ctx.app?.$cookies?.get('pb_auth'))
  // load the store data from the request cookie string
    // pb.authStore.loadFromCookie(ctx.req?.headers?.cookie || '')
  pb.authStore.loadFromCookie(ctx.app?.$cookies?.get('pb_auth') || '')

  // send back the default 'pb_auth' cookie to the client with the latest store state
  pb.authStore.onChange(() => {
    ctx.app?.$cookies?.set(
      'pb_auth',
      pb.authStore.exportToCookie({ secure: false })
    )
  })

  try {
    // get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
    pb.authStore.isValid && (await pb.collection('users').authRefresh())
  } catch (_) {
    // clear the auth store on failed refresh
    ctx.app?.$cookies?.remove('pb_auth')
    pb.authStore.clear()
  }

  inject('pocketbase', pb)
}