import React from 'react';
import * as RN from 'react-native';

import * as Pickers from '@elik56a/react-native-pickers';
import { DemoButton } from '../../live/DemoButton';

const { View, Text, Pressable, Button, StyleSheet, ScrollView, TextInput, Switch, Image, Platform, I18nManager } = RN;

export default {
  React,
  ...React,
  ...Pickers,
  View,
  Text,
  Pressable,
  Button,
  DemoButton,
  StyleSheet,
  ScrollView,
  TextInput,
  Switch,
  Image,
  Platform,
  I18nManager,
};
