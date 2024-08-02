import Layout from '../../components/Layout/Layout';
import Settings from '../../components/Dashboard/DashboardComponents//Settings/Settings';
import { getServerSession } from 'next-auth';
import { authOption } from '../api/auth/[...nextauth]/route';
import axios from 'axios';
import { IUser } from '../lib/interfaces/user';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const settings = async () => {
  const auth = cookies().toString()

  const session = await getServerSession(authOption).catch(console.error)
  if (!session || !session.user) notFound()

  const user = await axios.get(`${process.env.NEXTAUTH_URL}/api/users`, {
    params: {
      id: session.user._id,
    },
    headers: {
      Cookie: auth
    }
  }).then(res => {
    // console.log('response is', res)
    return res.data[0] as IUser
  }).catch(err => {
    console.log('error occured', err.response?.data?.message || err.message || err)
  })

  if (!user) notFound()

  return (
    <Layout>
      <Settings _user={user} />
    </Layout>
  );
};

export default settings;
