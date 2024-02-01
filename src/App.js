import React, { useState, useEffect } from "react";
import "./App.css";
import "@aws-amplify/ui-react/styles.css";
import {
  Button,
  Flex,
  Heading,
  Text,
  TextField,
  Image,
  View,
  withAuthenticator,
} from "@aws-amplify/ui-react";
import {
  Table,
  TableCell,
  TableBody,
  TableHead,
  TableRow,
} from '@aws-amplify/ui-react';
import { listNotes } from "./graphql/queries";
import {
  createNote as createNoteMutation,
  deleteNote as deleteNoteMutation,
} from "./graphql/mutations";
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl, remove } from 'aws-amplify/storage';
import Header from "./Header";

const client = generateClient();

const App = ({ signOut }) => {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await client.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(
      notesFromAPI.map(async (note) => {
        if (note.image) {
          const url = await getUrl({ key: note.name });
          note.image = url.url;  
        }
        return note;
      })
    );
    setNotes(notesFromAPI);
  }

  async function createNote(event) {
    event.preventDefault();
    const form = new FormData(event.target);
    const image = form.get("image");
    const data = {
      name: form.get("name"),
      description: form.get("description"),
      image: image.name,
    };
    if (!!data.image) await uploadData({
      key: data.name,
      data: image
    });
    await client.graphql({
      query: createNoteMutation,
      variables: { input: data },
    });
    fetchNotes();
    event.target.reset();
  }

  async function deleteNote({ id, name }) {
    const newNotes = notes.filter((note) => note.id !== id);
    setNotes(newNotes);
    await remove({ key: name });
    await client.graphql({
      query: deleteNoteMutation,
      variables: { input: { id } },
    });
  }

  async function generateText() {
    console.log("generate text")
  }
  return (
    <View className="App">
    <Header />
      <Heading level={2}marginTop={30}>Accenture Notes App</Heading>
      <View as="form" margin="3rem 0" onSubmit={createNote}>
        <Flex direction="row" justifyContent="center">
          <TextField
            name="name"
            placeholder="Note Name"
            label="Note Name"
            labelHidden
            variation="quiet"
            required
          />
          <TextField
            name="description"
            placeholder="Note Description"
            label="Note Description"
            labelHidden
            variation="quiet"
            required
          />
          <div className="upload-btn-wrapper">
            <button className="btn">Upload a file</button>
            <input type="file" name="image"
            />
          </div>
          {/* <View
            name="image"
            as="input"
            type="file"
            style={{ alignSelf: "end" }}
          /> */}
          <Button type="submit" variation="primary" backgroundColor={'#7500c0'}fontWeight={400}fontSize={'18px'}>
            Create Note
          </Button>
          
        </Flex>
      </View>
      <View>
      {/* <Button type="submit" variation="primary" backgroundColor={'#7500c0'} onClick={() => generateText()}>
            Generate Text
          </Button> */}
      </View>
      <Heading level={2}>Current Notes</Heading>
      <View margin="40px auto" width={'90%'}>
      <Table
            caption=""
            highlightOnHover={true}            
            variation="">
            <TableHead >
              <TableRow backgroundColor={'#a100ff'} color={'#fff'}>
                <TableCell as="th" color={'#fff'}>Note</TableCell>
                <TableCell as="th" color={'#fff'}>Note Description</TableCell>
                <TableCell as="th" color={'#fff'}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
        {notes.map((note) => (
          // <Flex
          //   key={note.id || note.name}
          //   direction="row"
          //   justifyContent="center"
          //   alignItems="center"
          // >
          //   <Text as="strong" fontWeight={700}>
          //     {note.name}
          //   </Text>
          //   <Text as="span">{note.description}</Text>
          //   {note.image && (
          //     <Image
          //       src={note.image}
          //       alt={`visual aid for ${notes.name}`}
          //       style={{ width: 400 }}
          //     />
          //   )}
          //   <Button variation="link" onClick={() => deleteNote(note)}>
          //     Delete note
          //   </Button>
          // </Flex>
          
          
           
              <TableRow  key={note.id || note.name}>
                <TableCell>{note.name}</TableCell>
                <TableCell>{note.description}</TableCell> 
                {note.image && (
               <TableCell><Image
                 src={note.image}
                 alt={`visual aid for ${notes.name}`}
                 style={{ width: 400 }}
               /></TableCell>
             )}
                <TableCell>
                <Button variation="link" color={'#7500c0'} onClick={() => deleteNote(note)}>
                Delete note
               </Button>
                </TableCell>
              </TableRow>
           
         
  
        ))}
         </TableBody>
         </Table>
      </View>
      
      <Button onClick={signOut} backgroundColor={'#7500c0'} color={'#fff'} marginBottom={20}>Sign Out</Button>
    </View>
  );
};

export default withAuthenticator(App);