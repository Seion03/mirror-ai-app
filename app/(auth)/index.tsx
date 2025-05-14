import { Redirect } from 'expo-router';

export default function AuthIndex() {
  // This is correct - we're staying within the (auth) group
  return <Redirect href="/explore" />;
}