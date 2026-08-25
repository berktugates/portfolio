import {
  ProjectDetailPage,
  createProjectMetadata,
  projectStaticParams,
} from "../../../components/project-detail";

export const dynamicParams = false;

export function generateStaticParams() {
  return projectStaticParams();
}

type ProjectPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: ProjectPageProps) {
  return createProjectMetadata("fr", props);
}

export default function ProjectPage(props: ProjectPageProps) {
  return <ProjectDetailPage locale="fr" params={props.params} />;
}
