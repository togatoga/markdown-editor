import NextAuth from 'next-auth';
import { GenericObject } from 'next-auth/_utils';
import GithubProvider from 'next-auth/providers/github';

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID ?? '',
      clientSecret: process.env.GITHUB_SECRET ?? '',
      // @ts-ignore
      scope: 'read:user',
    }),
  ],
  secret: process.env.SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    /**
     * @param  {object} user     User object
     * @param  {object} account  Provider account
     * @param  {object} profile  Provider profile
     * @return {boolean|string}  Return `true` to allow sign in
     *                           Return `false` to deny access
     *                           Return `string` to redirect to (eg.: "/unauthorized")
     */
    async signIn(_user, _account, _profile) {
      return true;
    },
  },
});
