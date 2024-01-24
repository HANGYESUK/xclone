import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { database } from '../firebase.ts';
import { useEffect, useState } from 'react';
import Tweet from './Tweet.tsx';

export interface ITweet {
  userId: string;
  userName: string;
  tweetText: string;
  createDate: number;
  photos?: string[];
  id: string;
}

const Timeline = () => {
  const [tweets, setTweet] = useState<ITweet[]>([]);

  useEffect(() => {
    const fetchTweet = query(collection(database, 'tweet'), orderBy('createDate', 'desc'));

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
    <>
      {tweets.map((item) => {
        return (
          <div style={{ maxHeight: '200px' }}>
            <Tweet {...item} />
          </div>
        );
      })}
    </>
  );
};

export default Timeline;
