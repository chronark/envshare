import { Client } from "../client"



export default function Page(props: { params: { compositeKey: string } }) {
    return <Client compositeKey={props.params.compositeKey} />
}