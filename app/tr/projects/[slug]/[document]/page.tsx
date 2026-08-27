import { ProjectLegalPage, createProjectLegalMetadata, projectLegalStaticParams } from "../../../../components/project-legal-page";
export const dynamicParams = false;
export const generateStaticParams = projectLegalStaticParams;
type Props = { params: Promise<{ slug: string; document: string }> };
export function generateMetadata(props: Props) { return createProjectLegalMetadata("tr", props); }
export default function Page(props: Props) { return <ProjectLegalPage locale="tr" params={props.params} />; }
