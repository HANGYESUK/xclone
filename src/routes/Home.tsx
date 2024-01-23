import PostTweetForm from '../components/PostTweetForm.tsx';
import styled from 'styled-components';
import Timeline from '../components/Timeline.tsx';

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-auto-rows: 1fr 5fr;
`;

export default function Home() {
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
