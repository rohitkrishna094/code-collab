const defaultJava = `public class Main {
  public static void main(String[] args) {
      System.out.println("hello world");
  }
}`;

const defaultCSharp = `using System;

class Program {
    static void Main(string[] args) {
        Console.WriteLine("Hello, world!");
    }
}`;

const defaultPython = `print('Hello, World')`;

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
  extension: string;
}

export const getExtensionByLangId = (id: string) => {
  const langData = languageDataWithKeys[id];
  return langData.extension;
};

export const languageDataWithKeys: { [key: string]: Item } = {
  '50': {
    languageId: 50,
    name: 'C',
    mode: 'c_cpp',
    defaultValue: defaultC,
    extension: 'c',
  },
  '54': {
    languageId: 54,
    name: 'C++',
    mode: 'c_cpp',
    defaultValue: defaultCpp,
    extension: 'cpp',
  },
  '86': {
    languageId: 86,
    name: 'Clojure',
    mode: 'clojure',
    defaultValue: defaultClojure,
    extension: 'clj',
  },
  '51': {
    languageId: 51,
    name: 'C#',
    mode: 'csharp',
    defaultValue: defaultCSharp,
    extension: 'cs',
  },
  '60': {
    languageId: 60,
    name: 'Go',
    mode: 'golang',
    defaultValue: defaultGo,
    extension: 'go',
  },
  '62': {
    languageId: 62,
    name: 'Java',
    mode: 'java',
    defaultValue: defaultJava,
    extension: 'java',
  },
  '63': {
    languageId: 63,
    name: 'Javascript',
    mode: 'javascript',
    defaultValue: defaultJavascript,
    extension: 'js',
  },
  '78': {
    languageId: 78,
    name: 'Kotlin',
    mode: 'kotlin',
    defaultValue: defaultKotlin,
    extension: 'kt',
  },
  '68': {
    languageId: 68,
    name: 'PHP',
    mode: 'php',
    defaultValue: defaultPhp,
    extension: 'php',
  },
  '71': {
    languageId: 71,
    name: 'Python',
    mode: 'python',
    defaultValue: defaultPython,
    extension: 'py',
  },
  '72': {
    languageId: 72,
    name: 'Ruby',
    mode: 'ruby',
    defaultValue: defaultRuby,
    extension: 'rb',
  },
  '74': {
    languageId: 74,
    name: 'Typescript',
    mode: 'typescript',
    defaultValue: defaultTypescript,
    extension: 'ts',
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
