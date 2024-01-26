import styled from 'styled-components';
import { auth, database, storage } from '../firebase.ts';
import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import Tweet from '../components/Tweet.tsx';
import { ITweet } from '../components/Timeline.tsx';
import { collection, onSnapshot, orderBy, query, where, limit } from 'firebase/firestore';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const ProfileImgUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const Tweets = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 10px;
`;

const ProfileImg = styled.img`
  width: 100%;
  box-sizing: border-box;
`;
const ProfileImgInput = styled.input`
  display: none;
`;
const UserName = styled.span`
  font-size: 22px;
`;

const Profile = () => {
  const user = auth.currentUser;
  const [profileImg, setProfileImg] = useState(user?.photoURL);
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const onProfileImgChange = async (e: BaseSyntheticEvent) => {
    if (!user) return;
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];
      const locationRef = ref(storage, `profileImg/${user.uid}`);
      const result = await uploadBytes(locationRef, file);
      const profileImgUrl = await getDownloadURL(result.ref);
      setProfileImg(profileImgUrl);
      await updateProfile(user, {
        photoURL: profileImgUrl,
      });
    }
  };

  useEffect(() => {
    const fetchTweet = query(
      collection(database, 'tweet'),
      where('userId', '==', user?.uid),
      orderBy('createDate', 'desc'),
      limit(25),
    );

    const unsubscribe = onSnapshot(fetchTweet, (snapshot) => {
      const data: ITweet[] = [];
      snapshot.forEach((item) => {
        const { userName, userId, createDate, photos, tweetText } = item.data();

        data.push({ userName, userId, createDate, photos, tweetText, id: item.id });
      });
      setTweet(data);
    });

    return () => unsubscribe && unsubscribe();
  }, []);

  return (
    <Wrapper>
      <ProfileImgUpload htmlFor="profileImg">
        {profileImg ? (
          <ProfileImg src={profileImg} />
        ) : (
          <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
          </svg>
        )}
      </ProfileImgUpload>
      <ProfileImgInput onChange={onProfileImgChange} id="profileImg" type="file" accept="image/*" />
      <UserName>{user?.displayName ?? 'Anonymous'}</UserName>
      <Tweets>
        {tweets.map((tweet) => (
          <Tweet key={tweet.id} {...tweet} canDelete={true} />
        ))}
      </Tweets>
    </Wrapper>
  );
};

export default Profile;
