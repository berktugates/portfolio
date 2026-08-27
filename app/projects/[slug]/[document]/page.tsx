import {
  ProjectLegalPage,
  createProjectLegalMetadata,
  projectLegalStaticParams,
} from "../../../components/project-legal-page";

type LegalPageProps = { params: Promise<{ slug: string; document: string }> };

export function generateStaticParams() {
  return projectLegalStaticParams();
}

export function generateMetadata(props: LegalPageProps) {
  return createProjectLegalMetadata("en", props);
}

export default function LegalPage(props: LegalPageProps) {
  return <ProjectLegalPage locale="en" params={props.params} />;
}
