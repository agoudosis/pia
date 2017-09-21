import { ApplicationDb } from '../application.db';
import { Answer } from 'app/entry/entry-content/questions/answer.model';

export class Pia extends ApplicationDb {
  public id: number;
  public status: number; // 0: doing, 1: refused, 2: simple_validation, 3: signed_validation, 4: archived
  public name: string;
  public author_name: string;
  public evaluator_name: string;
  public validator_name: string;
  public dpo_status: number; // 0: NOK, 1: OK
  public dpo_opinion: string;
  public concerned_people_opinion: string;
  public concerned_people_status: number; // 0: NOK, 1: OK
  public rejected_reason: string;
  public applied_adjustements: string;
  public dpos_names: string;
  public people_names: string;
  public progress: number;

  constructor() {
    super(201707071818, 'pia');
    this.created_at = new Date();
  }

  /**
   * Find all entries without conditions
   */
  async getAll() {
    // TODO Auto calcul questions number
    const numberOfQuestions = 36;
    const items = [];
    return new Promise((resolve, reject) => {
      this.findAll().then((entries: any) => {
        entries.forEach(element => {
          const newPia = new Pia();
          newPia.id = element.id;
          newPia.name = element.name;
          newPia.author_name = element.author_name;
          newPia.evaluator_name = element.evaluator_name;
          newPia.validator_name = element.validator_name;
          newPia.dpo_status = element.dpo_status;
          newPia.dpo_opinion = element.dpo_opinion;
          newPia.concerned_people_opinion = element.concerned_people_opinion;
          newPia.concerned_people_status = element.concerned_people_status;
          newPia.rejected_reason = element.rejected_reason;
          newPia.applied_adjustements = element.applied_adjustements;
          newPia.status = element.status;
          newPia.dpos_names = element.dpos_names;
          newPia.people_names = element.people_names;
          newPia.created_at = new Date(element.created_at);
          newPia.updated_at = new Date(element.updated_at);
          const answer = new Answer();
          answer.findAllByPia(element.id).then((answers: any) => {
            newPia.progress = Math.round((100 / numberOfQuestions) * answers.length);
            items.push(newPia);
          });
        });
        resolve(items);
      });
    });
  }

  async create() {
    if (this.created_at === undefined) {
      this.created_at = new Date();
    }

    const data = {
      name: this.name,
      author_name: this.author_name,
      evaluator_name: this.evaluator_name,
      validator_name: this.validator_name,
      dpo_status: this.dpo_status,
      dpo_opinion: this.dpo_opinion,
      concerned_people_opinion: this.concerned_people_opinion,
      concerned_people_status: this.concerned_people_status,
      rejected_reason: this.rejected_reason,
      applied_adjustements: this.applied_adjustements,
      created_at: this.created_at,
      updated_at: this.updated_at,
      status: 0,
      dpos_names: this.dpos_names,
      people_names: this.people_names
    };

    return new Promise((resolve, reject) => {
      if (this.serverUrl) {
        const formData = new FormData();
        for(let d in data) {
          formData.append('pia[' + d + ']', data[d]);
        }
        fetch(this.getServerUrl(), {
          method: "POST",
          body: formData
        }).then((response) => {
          return response.json();
        }).then((result: any) => {
          resolve(result.id);
        }).catch ((error) => {
          console.error('Request failed', error);
        });
      } else {
        this.getObjectStore().then(() => {
          this.objectStore.add(data).onsuccess = (event: any) => {
            resolve(event.target.result);
          };
        });
      }
    });
  }

  async update() {
    return new Promise((resolve, reject) => {
      this.find(this.id).then((entry: any) => {
        entry.name = this.name;
        entry.author_name = this.author_name;
        entry.evaluator_name = this.evaluator_name;
        entry.validator_name = this.validator_name;
        entry.dpo_status = this.dpo_status;
        entry.dpo_opinion = this.dpo_opinion;
        entry.concerned_people_opinion = this.concerned_people_opinion;
        entry.concerned_people_status = this.concerned_people_status;
        entry.rejected_reason = this.rejected_reason;
        entry.applied_adjustements = this.applied_adjustements;
        entry.status = this.status;
        entry.dpos_names = this.dpos_names;
        entry.people_names = this.people_names;
        entry.updated_at = new Date();
        if (this.serverUrl) {
          const formData = new FormData();
          for(let d in entry) {
            formData.append('pia[' + d + ']', entry[d]);
          }
          fetch(this.getServerUrl() + '/' + entry.id, {
            method: "PATCH",
            body: formData
          }).then((response) => {
            return response.json();
          }).then((result: any) => {
            resolve();
          }).catch ((error) => {
            console.error('Request failed', error);
          });
        } else {
          this.getObjectStore().then(() => {
            this.objectStore.put(entry).onsuccess = () => {
              resolve();
            };
          });
        }
      });
    });
  }

  async get(id: number) {
    this.id = id;
    return new Promise((resolve, reject) => {
      this.find(this.id).then((entry: any) => {
        if (entry) {
          this.status = entry.status;
          this.name = entry.name;
          this.author_name = entry.author_name;
          this.evaluator_name = entry.evaluator_name;
          this.validator_name = entry.validator_name;
          this.dpo_status = entry.dpo_status;
          this.dpo_opinion = entry.dpo_opinion;
          this.concerned_people_opinion = entry.concerned_people_opinion;
          this.concerned_people_status = entry.concerned_people_status;
          this.rejected_reason = entry.rejected_reason;
          this.applied_adjustements = entry.applied_adjustements;
          this.created_at = new Date(entry.created_at);
          this.updated_at = new Date(entry.updated_at);
          this.dpos_names = entry.dpos_names;
          this.people_names = entry.people_names;
        }
        resolve();
      });
    });
  }

  getStatusName() {
    switch (this.status) {
      case 0:
      {
        return 'pia.statuses.0';
      }
      case 1:
      {
        return 'pia.statuses.1';
      }
      case 2:
      {
        return 'pia.statuses.2';
      }
      case 3:
      {
        return 'pia.statuses.3';
      }
      case 4:
      {
        return 'pia.statuses.4';
      }
    }
  }
  getOpinionsStatus(status: string) {
    if (status) {
      switch (status) {
        case '0':
        {
          return 'summary.content_choice_nok';
        }
        case '1':
        {
          return 'summary.content_choice_ok';
        }
      }
    }
  }

  getGaugeName(value: number) {
    if (value === 1) {
      return 'summary.gauges.negligible';
    } else if (value === 2) {
      return 'summary.gauges.limited';
    } else if (value === 3) {
      return 'summary.gauges.important';
    } else if (value === 4) {
      return 'summary.gauges.maximal';
    }
  }
}



