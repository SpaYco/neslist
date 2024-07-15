"use client";

import Accordion from "react-bootstrap/Accordion";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import crypto from "crypto";

import { useState, useEffect, useRef } from "react";

export default function Home() {
  const [myLists, setMyLists] = useState([]);

  useEffect(() => {
    const data = localStorage.getItem("myLists");

    if (data && JSON.parse(data)?.length > 0) {
      setMyLists(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    if (myLists.length === 0) {
      return;
    }

    localStorage.setItem("myLists", JSON.stringify(myLists));
  }, [myLists]);

  const changeItem = (listId, itemId) => {
    const updatedLists = myLists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              finished: !item.finished,
            };
          }
          return item;
        });
        return {
          ...list,
          items: updatedItems,
        };
      }
      return list;
    });
    setMyLists(updatedLists);
  };

  const generateHash = () => {
    return crypto.randomBytes(20).toString("hex");
  };

  const addList = () => {
    const newList = {
      id: generateHash(),
      name: "New List",
      items: [],
    };
    setMyLists([...myLists, newList]);
  };

  const changeItemValue = (e, listId, itemId) => {
    const updatedLists = myLists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.map((item) => {
          if (item.id === itemId) {
            return {
              ...item,
              name: e.target.value,
            };
          }
          return item;
        });
        return {
          ...list,
          items: updatedItems,
        };
      }
      return list;
    });
    setMyLists(updatedLists);
  };

  const changeListName = (e, listId) => {
    const updatedLists = myLists.map((list) => {
      if (list.id === listId) {
        return {
          ...list,
          name: e.target.textContent,
        };
      }
      return list;
    });
    setMyLists(updatedLists);
  };

  const addItem = (listId) => {
    const updatedLists = myLists.map((list) => {
      if (list.id === listId) {
        const newItem = {
          id: generateHash(),
          name: "New Item",
          finished: false,
        };
        return {
          ...list,
          items: [...list.items, newItem],
        };
      }
      return list;
    });
    setMyLists(updatedLists);
  };

  const deleteItem = (listId, itemId) => {
    const updatedLists = myLists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.filter((item) => item.id !== itemId);
        return {
          ...list,
          items: updatedItems,
        };
      }
      return list;
    });
    setMyLists(updatedLists);
  }

  const resetList = (listId) => {
    const updatedLists = myLists.map((list) => {
      if (list.id === listId) {
        const updatedItems = list.items.map((item) => {
          return {
            ...item,
            finished: false,
          };
        });
        return {
          ...list,
          items: updatedItems,
        };
      }
      return list;
    });
    setMyLists(updatedLists);
  };

  const calculateProgress = (listId) => {
    const list = myLists.find((list) => list.id === listId);
    const totalItems = list.items.length;

    if (totalItems === 0) {
      return 0;
    }

    const finishedItems = list.items.filter((item) => item.finished).length;
    return Math.round((finishedItems / totalItems) * 100);
  };

  return (
    <main>
      <h1>My Lists</h1>

      <div className='container-fluid'>
        <div className='row'>
          {myLists.map((list) => (
            <div className='col-12'>
              <Accordion className='mb-3' key={list.id}>
                <Accordion.Item key={list.id}>
                  <EditableAccordionHeader
                    list={list}
                    changeListName={changeListName}
                  />
                  <Accordion.Body>
                    {list.items.map((item) => (
                      <div key={item.id}>
                        <InputGroup className='mb-3'>
                          <InputGroup.Checkbox
                            aria-label='Checkbox for following text input'
                            checked={item.finished}
                            onChange={() => changeItem(list.id, item.id)}
                          />
                          <Form.Control
                            aria-label='Text input with checkbox'
                            value={item.name}
                            onChange={(e) =>
                              changeItemValue(e, list.id, item.id)
                            }
                          />
                          <Button
                            variant='outline-danger'
                            size='xs'
                            onClick={() => deleteItem(list.id, item.id)}
                          > Delete
                          </Button>
                        </InputGroup>
                      </div>
                    ))}

                    <Button
                      variant='outline-primary me-3'
                      size='xs'
                      onClick={() => addItem(list.id)}
                    >
                      Add an Item
                    </Button>

                    <Button
                      variant='outline-danger me-3'
                      size='xs'
                      onClick={() => resetList(list.id)}
                    >
                      Reset
                    </Button>

                    <Button
                      variant='outline-secondary me-3'
                      size='xs'
                    >
                      {calculateProgress(list.id)}%
                    </Button>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </div>
          ))}
        </div>
      </div>

      <div className='d-grid gap-2'>
        <Button variant='outline-primary' size='lg' onClick={addList}>
          Add a list
        </Button>
      </div>
    </main>
  );
}

const EditableAccordionHeader = ({ list, changeListName }) => {
  const nameRef = useRef(list.name);

  return (
    <Accordion.Header
      onInput={(e) => changeListName(e, list.id)}
      aria-placeholder='Enter a name'
    >
      <input
        ref={nameRef}
        value={list.name}
        onChange={(e) => changeListName(e, list.id)}
      />
    </Accordion.Header>
  );
};
