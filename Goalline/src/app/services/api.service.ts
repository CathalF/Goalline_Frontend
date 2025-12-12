import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, lastValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Auth endpoints
  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login`, credentials);
  }

  register(userData: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, userData);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/logout`, {});
  }

  getProfile(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/profile`);
  }

  updateProfile(data: {email?: string, password?: string}): Promise<any> {
    return lastValueFrom(this.http.put(`${this.baseUrl}/auth/profile`, data));
  }

  deleteAccount(): Promise<any> {
    return lastValueFrom(this.http.delete(`${this.baseUrl}/auth/profile`));
  }

  // Competitions
  getCompetitions(page: number = 1, pageSize: number = 20, country?: string, name?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    
    if (country) {
      params = params.set('country', country);
    }
    if (name) {
      params = params.set('name', name);
    }
    
    return this.http.get(`${this.baseUrl}/competitions/`, { params });
  }

  getCompetition(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/competitions/${id}`);
  }

  createCompetition(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/competitions/`, data);
  }

  deleteCompetition(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/competitions/${id}`);
  }

  // Teams
  getTeams(page: number = 1, pageSize: number = 20, name?: string, country?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());
    
    if (name) params = params.set('name', name);
    if (country) params = params.set('country', country);

    return this.http.get(`${this.baseUrl}/teams/`, { params });
  }

  getTeam(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/teams/${id}`);
  }

  createTeam(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/teams/`, data);
  }

  deleteTeam(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/teams/${id}`);
  }

  // Matches
  getMatches(params?: any): Observable<any> {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return this.http.get(`${this.baseUrl}/matches/`, { params: httpParams });
  }

  getMatch(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/matches/${id}`);
  }

  createMatch(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/matches/`, data);
  }

  deleteMatch(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/matches/${id}`);
  }

  // Players
  getPlayers(page: number = 1, pageSize: number = 20, name?: string): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    if (name) {
      params = params.set('name', name);
    }

    return this.http.get(`${this.baseUrl}/players/`, { params });
  }

  getPlayer(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/players/${id}`);
  }

  createPlayer(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/players/`, data);
  }

  deletePlayer(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/players/${id}`);
  }

  // Seasons
  getSeasons(page: number = 1, pageSize: number = 20): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('page_size', pageSize.toString());

    return this.http.get(`${this.baseUrl}/seasons/`, { params });
  }

  createSeason(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/seasons/`, data);
  }

  deleteSeason(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/seasons/${id}`);
  }

  // Notes
  getNotesByMatch(matchId: string): Observable<any> {
    let params = new HttpParams().set('match_id', matchId);
    return this.http.get(`${this.baseUrl}/notes`, { params });
  }

  createNote(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/notes/`, data);
  }

  updateNote(id: string, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/notes/${id}`, data);
  }

  deleteNote(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/notes/${id}`);
  }

  // Tables
  getLeagueTable(competitionId: string, seasonId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/tables/${competitionId}/${seasonId}`);
  }

  // Analytics
  getHeadToHead(team1: string, team2: string, filters?: any): Observable<any> {
    let params = new HttpParams()
      .set('team1', team1)
      .set('team2', team2);

    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params = params.set(key, filters[key]);
        }
      });
    }

    return this.http.get(`${this.baseUrl}/analytics/h2h`, { params });
  }

  getTeamForm(n: number = 5, by: string = 'overall', team?: string): Observable<any> {
    let params = new HttpParams()
      .set('n', n.toString())
      .set('by', by);

    if (team) {
      params = params.set('team', team);
    }

    return this.http.get(`${this.baseUrl}/analytics/form`, { params });
  }

  getStreaks(type: string = 'winning', limit: number = 10): Observable<any> {
    let params = new HttpParams()
      .set('type', type)
      .set('limit', limit.toString());

    return this.http.get(`${this.baseUrl}/analytics/streaks`, { params });
  }
}
