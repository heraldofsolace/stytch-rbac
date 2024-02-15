import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import InviteForm from '@/components/invite-form';
import { client } from '@/lib/stytch-client';
import { Organization } from 'stytch';

export default async function MembersList({
    organization, jwt
}: { organization: Organization, jwt: string }) {
    const { members } = await client.organizations.members.search({
        organization_ids: [organization.organization_id],
      });

    return (
        <Card className="w-full max-w-sm">
        <CardHeader className="pb-4">
          <CardTitle>Members</CardTitle>
        </CardHeader>
        <CardContent>
          {members.map((member) => {
            return (
              <div key={member.member_id} className="flex justify-between">
                <span>[{member.is_admin ? 'Admin' : 'Member'}]</span>
                <span>{member.email_address}</span>
                <span>({member.status})</span>
              </div>
            );
          })
          }
          <Separator className="mb-4" />
          <InviteForm organization_slug={organization.organization_slug} />
        </CardContent>

      </Card>
    )
}