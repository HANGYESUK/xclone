import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { database } from '../firebase.ts';
import { useEffect, useState } from 'react';
import Tweet from './Tweet.tsx';

export interface ITweet {
  userId: string;
  userName: string;
  tweetText: string;
  createDate: number;
  photos?: string[];
  id?: string;
}

const Timeline = () => {
  const [tweets, setTweet] = useState<ITweet[]>([]);
  const tweetQuery = async () => {
    const fetchTweet = query(collection(database, 'tweet'), orderBy('createDate', 'desc'));
    const tweetData = await getDocs(fetchTweet);
    const result = tweetData.docs.map((item) => {
      const { userName, userId, createDate, photos, tweetText } = item.data();
      return {
        tweetText,
        createDate,
        userId,
        userName,
        photos,
      };
    });
    setTweet(result);
  };

  useEffect(() => {
    tweetQuery();
  }, []);

  return (
    <>
      {tweets.map((item) => {
        return (
          <div>
            <Tweet {...item} />
          </div>
        );
      })}
    </>
  );
};

export default Timeline;
