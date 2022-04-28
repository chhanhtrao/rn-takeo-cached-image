/// <reference types="react" />
import { ImageProps } from 'react-native';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
export declare const getLocalURI: (remoteUri: string, db?: SQLiteDatabase | undefined) => Promise<any>;
export declare const CachedImage: (props: ImageProps) => JSX.Element;
