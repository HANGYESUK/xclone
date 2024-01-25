import PostTweetForm from '../components/PostTweetForm.tsx';
import styled from 'styled-components';
import Timeline from '../components/Timeline.tsx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
