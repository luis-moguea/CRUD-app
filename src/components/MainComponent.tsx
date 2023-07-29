import {
  Box,
  Button,
  Input,
  List,
  ListItem,
  Text,
  HStack,
  useMediaQuery,
} from "@chakra-ui/react";
import dataHook, { DataFetch } from "../hooks/dataHook";
import SpinnerComp from "./SpinnerCom";
import { FormEvent, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosError } from "axios";
import DarkModeSwitch from "./DarkModeSwitch";

const MainComponent = () => {
  const [updating, setUpdating] = useState<number | null>(null);
  const [updateError, setUpdateError] = useState("");
  const [newPostError, setNewPostError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [newBody, setNewBody] = useState("");
  const [newPost, setNewPost] = useState("");
  const { data, error, loading, setData, setError, setLoading } = dataHook();
  const [isHigherThan480] = useMediaQuery("(min-width: 480px)");

  const preventDefault = (event: FormEvent) => {
    event.preventDefault();
  };

  const deleteData = (body: DataFetch, index: number) => {
    const fetchedData = async () => {
      const originalData = [...data];

      try {
        setDeleteLoading(index);
        await apiClient.delete("/posts/" + body.body);
        setData(data.filter((el) => el.body !== body.body));
        setDeleteLoading(null);
        setUpdating(null);
      } catch (err) {
        setError((err as AxiosError).message);
        setData(originalData);
      } finally {
        setDeleteLoading(null);
      }

      setTimeout(() => {
        setError("");
      }, 4000);
    };
    fetchedData();
  };

  const updateData = (body: DataFetch | any) => {
    const fetchedData = async () => {
      const updatedData = { body: newBody };

      if (newBody.length === 0) {
        setUpdateError("Please update the note");

        setTimeout(() => {
          setUpdateError("");
        }, 3000);
      } else {
        try {
          setData(data.map((el) => (el.body === body.body ? updatedData : el)));
          await apiClient.patch("/posts/" + body.body);
          setUpdating(null);
          setNewBody("");
        } catch (err) {
          setError((err as AxiosError).message);
        }

        setTimeout(() => {
          setError("");
        }, 4000);
      }
    };

    fetchedData();
  };

  const postData = () => {
    const fetchedData = async () => {
      const newPostBody = { body: newPost };

      if (newPost.length <= 0) {
        setNewPostError("Please type a new note");

        setTimeout(() => {
          setNewPostError("");
        }, 3000);
      } else {
        try {
          setLoading(true);
          setData([newPostBody, ...data]);
          await apiClient.post("/posts", ...data);
          setNewPost("");
          setUpdating(null);
        } catch (err) {
          setError((err as AxiosError).message);
        } finally {
          setLoading(false);
        }

        setTimeout(() => {
          setError("");
        }, 4000);
      }
    };

    fetchedData();
  };

  const handleKeyDownPost = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      postData();
    }
  };

  return (
    <>
      <DarkModeSwitch />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        <form onSubmit={preventDefault}>
          {newPostError ? (
            <Text fontSize={isHigherThan480 ? "20px" : "14px"} padding="4em">
              {newPostError}
            </Text>
          ) : (
            <>
              <Box
                padding={isHigherThan480 ? "2em" : "unset"}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                maxWidth="1000px"
                mx="auto"
              >
                <Input
                  mt="20px"
                  maxWidth={isHigherThan480 ? "unset" : "200px"}
                  width="750px"
                  placeholder="Post a new note"
                  onChange={(event) => {
                    setNewPost(event.target.value);
                  }}
                  onKeyDown={handleKeyDownPost}
                ></Input>
                <Button
                  minWidth="80px"
                  onClick={() => postData()}
                  mb="20px"
                  mt="10px"
                >
                  ADD
                </Button>
              </Box>
            </>
          )}
        </form>

        <Box mx="auto" maxWidth={isHigherThan480 ? "800px" : "340px"}>
          {error && <Text>{error}</Text>}
          {loading && <SpinnerComp />}
          <List>
            {data.map((el, index) => (
              <ListItem key={index}>
                <Box
                  display="flex"
                  mb={isHigherThan480 ? "10px" : "20px"}
                  rounded="2xl"
                  border="solid"
                  borderWidth="1px"
                  padding="1em"
                  flexDirection={isHigherThan480 ? "unset" : "column"}
                  alignItems={isHigherThan480 ? "unset" : "center"}
                  justifyContent={isHigherThan480 ? "space-between" : "unset"}
                  minHeight={isHigherThan480 ? "unset" : "220px"}
                >
                  {updating === index ? (
                    <Box
                      display={isHigherThan480 ? "unset" : "flex"}
                      justifyContent={isHigherThan480 ? "unset" : "center"}
                      alignItems={isHigherThan480 ? "unset" : "center"}
                    >
                      <form onSubmit={preventDefault}>
                        {updateError ? (
                          <Text>{updateError}</Text>
                        ) : (
                          <Input
                            maxWidth={isHigherThan480 ? "unset" : "200px"}
                            onChange={(event) => setNewBody(event.target.value)}
                            placeholder="Update note"
                            width="767px"
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                updateData(el);
                              }
                            }}
                          ></Input>
                        )}
                        <HStack
                          justifyContent={isHigherThan480 ? "unset" : "center"}
                          mb={isHigherThan480 ? "unset" : "50px"}
                        >
                          <Button
                            onClick={() => updateData(el)}
                            size="sm"
                            variant="outline"
                            colorScheme="green"
                            mt="10px"
                          >
                            UPDATE
                          </Button>
                          <Button
                            mt="10px"
                            size="sm"
                            variant="ghost"
                            onClick={() => setUpdating(null)}
                          >
                            CANCEL
                          </Button>
                        </HStack>
                      </form>
                    </Box>
                  ) : (
                    <Text
                      textAlign={isHigherThan480 ? "unset" : "justify"}
                      mb={isHigherThan480 ? "unset" : "15px"}
                    >
                      {el.body}
                    </Text>
                  )}
                  {updating === index ? (
                    ""
                  ) : (
                    <HStack ml={isHigherThan480 ? "40px" : "unset"}>
                      <Button onClick={() => setUpdating(index)}>UPDATE</Button>
                      {deleteLoading === index ? (
                        <SpinnerComp />
                      ) : (
                        <Button
                          onClick={() => deleteData(el, index)}
                          colorScheme="red"
                        >
                          DELETE
                        </Button>
                      )}
                    </HStack>
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </>
  );
};

export default MainComponent;
