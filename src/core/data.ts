import { ReferencedData as Statistics } from '@server/statistics/types';
import * as WebLog from '@server/web/log';
import { TrialMeta, TrialMetaExt } from '@server/web/meta';
import * as GazeEvent from '@server/tobii/gaze-event';
import { UpdateInfo, Tests } from '@server/respTypes';

import { Chunk } from './transform';

const cache: {[x: string]: {[y: string]: any}} = {};

function request( method: string, path: string ): Promise<any> {

  let status: number;
  let statusText: string;

  return fetch( `http://localhost:3000/${path}`, {
    method,
    mode: 'cors',
    credentials: 'same-origin',
  })
  .then( res => {
    status = res.status;
    statusText = res.statusText;
    return res.json();
  })
  .then( json => {
    if (status === 200) {
      return Promise.resolve( json );
    }
    else {
      let error = statusText;
      if (json && json.error) {
        error = json.error;
      }
      return Promise.reject( new Error( `"${path}" returned "${error}" [${statusText}]` ) );
    }
  });
}

function put( path: string ): Promise<any> {
  return request( 'PUT', path );
}

function get( path: string ): Promise<any> {
  return request( 'GET', path );
}

function getCachedTrial( id: string, path: string ): Promise<any> {
  if (cache[ id ] && cache[ id ][ path ]) {
    return Promise.resolve( cache[ id ][ path ] );
  }
  else {
    return get( `trial/${id}/${path}` ).then( data => {
      if (!cache[ id ]) {
        cache[ id ] = {};
      }
      cache[ id ][ path ] = data;
      return Promise.resolve( data );
    });
  }
}

export function tests(): Promise<Tests> {
  return get( 'tests' );
}

export function updateTestsList(): Promise<UpdateInfo> {
  return get( 'tests/update' );
}

export function load( name: string ): Promise<Error> {
  return put( `test/${name}` );
}

export function downloadStatistics( test: string ): Promise<string> {
  return get( `test/${test}/stats` );
}

export function trials(): Promise<TrialMeta[]> {
  return get( 'trials' );
}

export function meta( id: string ): Promise<TrialMetaExt> {
  return getCachedTrial( id, 'meta' );
}

export function hits( id: string ): Promise<number[] | WebLog.WrongAndCorrect[]> {
  return getCachedTrial( id, 'hits' );
}

export function marksCorrect( id: string ): Promise<number[]> {
  return getCachedTrial( id, 'marks' );
}

export function marksWrong( id: string ): Promise<number[]> {
  return getCachedTrial( id, 'errors' );
}

export function targets( id: string ): Promise<WebLog.Clickable[]> {
  return getCachedTrial( id, 'targets' );
}

export function events( id: string ): Promise<WebLog.TestEvent[]> {
  return getCachedTrial( id, 'events' );
}

export function fixations( id: string ): Promise<GazeEvent.Fixation[]> {
  return getCachedTrial( id, 'gaze/fixations' );
}

export function saccades( id: string ): Promise<GazeEvent.Fixation[]> {
  return getCachedTrial( id, 'gaze/saccades' );
}

export function stats( id: string ): Promise<Statistics> {
  return getCachedTrial( id, 'stats' );
}

export function chunkStats( id: string, chunk: Chunk ): Promise<Statistics> {
  return getCachedTrial( id, `stats/${chunk.start}-${chunk.end}` );
}

/* Left unused
'/trial/:id': 'full trial data (WARNING! it may take tens of Mb to load)',
'/trial/:id/head': 'the trial head data (WARNING! it may take tens of Mb to load)',
'/trial/:id/gaze': 'the trial Tobii recording meta data (WARNING! it may take tens of Mb to load)',
'/trial/:id/gaze/stimuli': 'the trial gaze stimuli',
'/trial/:id/gaze/events': 'the trial mouse and keyboards events',
'/trial/:id/gaze/samples': 'the trial gaze samples',
'/trial/:id/gaze/gazeAways': 'the trial gazeAways',
*/
