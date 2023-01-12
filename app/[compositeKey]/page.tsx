import { Client } from "../unseal/client";

export default function Page(props: { params: { compositeKey: string } }) {
  return <Client compositeKey={props.params.compositeKey} />;
}
