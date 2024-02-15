import IsAuthenticated from '@/components/is-authenticated';

import { authenticate, client } from "@/lib/stytch-client";
import MembersList from '@/components/members-list';
import SSOConnections from '@/components/sso-connections';

export default async function DashboardPage({
  params,
}: {
  params: { slug: string };
}) {
  const { organization, member, jwt } = await authenticate();
  return (
    <IsAuthenticated>
      
      {member.is_admin && (
        <>
          <SSOConnections organization={organization} jwt={jwt} />
          <MembersList organization={organization} jwt={jwt} />
        </>

      )}
      <div className="flex flex-col text-sm w-full max-w-sm p-2">
        <div>
          <span className="font-semibold">Organization name: </span>
          <span className="font-mono text-gray-700">
            {organization.organization_name}
          </span>
        </div>
        <div>
          <span className="font-semibold">Organization slug: </span>
          <span className="font-mono text-gray-700">
            {organization.organization_slug}
          </span>
        </div>
        <div>
          <span className="font-semibold">User: </span>
          <span className="font-mono text-gray-700">
            {member.email_address} {member.is_admin ? '(admin)' : '(member)'}
          </span>
        </div>
      </div>
    </IsAuthenticated>
  );
}

