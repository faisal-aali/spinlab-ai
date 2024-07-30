import Layout from '../../components/Layout/Layout';
import Settings from '../../components/Dashboard/DashboardComponents//Settings/Settings';
import { getServerSession } from 'next-auth';
import { authOption } from '../api/auth/[...nextauth]/route';
import axios from 'axios';
import { IUser } from '../lib/interfaces/users';
import { cookies } from 'next/headers';

const settings = async () => {
  const session = await getServerSession(authOption).catch(console.error)
  if (!session || !session.user) throw new Error('Failed to fetch user session')

  const user = await axios.get(`${process.env.NEXTAUTH_URL}/api/users`, {
    params: {
      id: session.user._id,
    },
    headers: {
      Cookie: cookies().toString()
    }
  }).then(res => {
    // console.log('response is', res)
    return res.data[0] as IUser
  }).catch(err => {
    console.log('error occured', err.response?.data?.message || err.message || err)
  })

  if (!user) throw new Error('Failed to fetch user')

  return (
    <Layout>
      <Settings _user={user} />
    </Layout>
  );
};

export default settings;
