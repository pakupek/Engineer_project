import ForumDetailClient from "./ForumDetailClient";

export default function ForumPage({ params }) {
  const { id } = params;

  return <ForumDetailClient discussionId={id} />;
}
