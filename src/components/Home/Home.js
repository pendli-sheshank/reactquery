import { useQuery } from "react-query";
import axios from "axios";
import React from "react";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
const fetchPost = async (id) => {
  try {
    const { data } = await axios.get(
      `https://gorest.co.in/public/v2/posts?page=${id}`
    );
    return data;
  } catch (error) {
    throw Error("Unable to fetch");
  }
};

const Home = () => {
  const { id } = useParams();
  const pageId = parseInt(id);
  const history = useNavigate();
  const toast = useToast();
  const { data, isLoading, error } = useQuery(
    ["posts", pageId],
    () => fetchPost(pageId),
    {
      keepPreviousData: true,
      onError: (error) => {
        toast({ status: "error", title: error.message });
      },
    }
  );
  console.log(data);
  return (
    <Container maxW="1024px" mt="4">
      <>
        {isLoading ? (
          <Grid>
            <Spinner />
          </Grid>
        ) : (
          <>
            <Flex justify="space-between" mb="4">
              <Button
                onClick={() => {
                  if (pageId >= 1) {
                    history(`/${pageId - 1}`);
                  }
                }}
                disabled={pageId <= 1}
                colorScheme="red"
              >
                Prev
              </Button>
              <Text>Current page : {pageId}</Text>
              <Button
                onClick={() => {
                  history(`/${pageId + 1}`);
                }}
                colorScheme="green"
              >
                Next
              </Button>
            </Flex>
            {data?.map((post, index) => (
              <Stack
                key={index}
                p="4"
                boxShadow="md"
                borderRadius="xl"
                border="1px solid #ccc"
              >
                <Flex justify="space-between">
                  <Text>User ID: {post.user_id}</Text>
                  <Text>Post ID: {post.id}</Text>
                </Flex>
                <Heading fontSize="2xl">{post.title}</Heading>
                <Text>{post.body}</Text>
              </Stack>
            ))}
          </>
        )}
      </>
    </Container>
  );
};

export default Home;
