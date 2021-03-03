const defaultJava = `public class Main {
  public static void main(String[] args) {
      System.out.println("hello world");
  }
}`;

const defaultCSharp = `public void HelloWorld() {
    //Say Hello!
    Console.WriteLine("Hello World");
}`;

const defaultPython = `def say_hello():
    print('Hello, World')`;

const defaultKotlin = `fun main() {
    println("Hello, World!")
}  `;

const defaultClojure = `(defn hello []
    (prn "Hello, World")
  )
  
(hello)`;

const defaultC = `#include <stdio.h>

int main() {
  printf("Hello, World\\n");
  return 0;
}`;

const defaultCpp = `#include <iostream>
using namespace std;

int main() {
  cout << "Hello World";
  return 0;
}`;

const defaultErlang = `-module(solution). 
-export([start/0]). 

start() -> 
   io:fwrite("Hello, world!\\n").`;

const defaultJavascript = `console.log("hello world");`;

const defaultRuby = `puts 'Hello World'`;

const defaultTypescript = `console.log("Hello World")`;

const defaultPhp = `<?php
  echo "Hello, World\\n";
?>`;

const defaultGo = `package main

import "fmt"

func main() {
  fmt.Println("Hello, World!")
}`;

export const languageData = [
  { languageId: 50, name: 'C', mode: 'c_cpp', defaultValue: defaultC },
  { languageId: 54, name: 'C++', mode: 'c_cpp', defaultValue: defaultCpp },
  {
    languageId: 86,
    name: 'Clojure',
    mode: 'clojure',
    defaultValue: defaultClojure,
  },
  { languageId: 51, name: 'C#', mode: 'csharp', defaultValue: defaultCSharp },
  {
    languageId: 58,
    name: 'Erlang',
    mode: 'erlang',
    defaultValue: defaultErlang,
  },
  { languageId: 60, name: 'Go', mode: 'golang', defaultValue: defaultGo },
  { languageId: 62, name: 'Java', mode: 'java', defaultValue: defaultJava },
  {
    languageId: 63,
    name: 'Javascript',
    mode: 'javascript',
    defaultValue: defaultJavascript,
  },
  {
    languageId: 78,
    name: 'Kotlin',
    mode: 'kotlin',
    defaultValue: defaultKotlin,
  },
  { languageId: 68, name: 'PHP', mode: 'php', defaultValue: defaultPhp },
  {
    languageId: 71,
    name: 'Python',
    mode: 'python',
    defaultValue: defaultPython,
  },
  { languageId: 72, name: 'Ruby', mode: 'ruby', defaultValue: defaultRuby },
  {
    languageId: 74,
    name: 'Typescript',
    mode: 'typescript',
    defaultValue: defaultTypescript,
  },
];

interface Item {
  languageId: number;
  name: string;
  mode: string;
  defaultValue: string;
}

export const languageDataWithKeys: { [key: string]: Item } = {
  '50': { languageId: 50, name: 'C', mode: 'c_cpp', defaultValue: defaultC },
  '54': {
    languageId: 54,
    name: 'C++',
    mode: 'c_cpp',
    defaultValue: defaultCpp,
  },
  '86': {
    languageId: 86,
    name: 'Clojure',
    mode: 'clojure',
    defaultValue: defaultClojure,
  },
  '51': {
    languageId: 51,
    name: 'C#',
    mode: 'csharp',
    defaultValue: defaultCSharp,
  },
  '58': {
    languageId: 58,
    name: 'Erlang',
    mode: 'erlang',
    defaultValue: defaultErlang,
  },
  '60': { languageId: 60, name: 'Go', mode: 'golang', defaultValue: defaultGo },
  '62': {
    languageId: 62,
    name: 'Java',
    mode: 'java',
    defaultValue: defaultJava,
  },
  '63': {
    languageId: 63,
    name: 'Javascript',
    mode: 'javascript',
    defaultValue: defaultJavascript,
  },
  '78': {
    languageId: 78,
    name: 'Kotlin',
    mode: 'kotlin',
    defaultValue: defaultKotlin,
  },
  '68': { languageId: 68, name: 'PHP', mode: 'php', defaultValue: defaultPhp },
  '71': {
    languageId: 71,
    name: 'Python',
    mode: 'python',
    defaultValue: defaultPython,
  },
  '72': {
    languageId: 72,
    name: 'Ruby',
    mode: 'ruby',
    defaultValue: defaultRuby,
  },
  '74': {
    languageId: 74,
    name: 'Typescript',
    mode: 'typescript',
    defaultValue: defaultTypescript,
  },
};

export const themes = [
  'monokai',
  'github',
  'tomorrow_night',
  'tomorrow',
  'kuroir',
  'twilight',
  'xcode',
  'textmate',
  'solarized_dark',
  'solarized_light',
  'terminal',
];
