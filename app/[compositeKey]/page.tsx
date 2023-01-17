import { redirect } from "next/navigation";

// This page is here for backwards compatibility with old links.
// Old links were of the form /{compositeKey} and now they are of the form /unseal#{compositeKey}
export default function Page(props: { params: { compositeKey: string } }) {
  return redirect(`/unseal#${props.params.compositeKey}`);
}
