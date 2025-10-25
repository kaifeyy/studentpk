import { PAKISTANI_EDUCATION_BOARDS, MATRIC_SUBJECT_GROUPS, O_LEVEL_SUBJECT_GROUPS, GRADE_LEVELS } from '../../../shared/pakistani-boards';

export class BoardsService {
  static async getAllBoards() {
    return PAKISTANI_EDUCATION_BOARDS;
  }

  static async getBoardsByType(type: 'matric' | 'o_level' | 'both') {
    return PAKISTANI_EDUCATION_BOARDS.filter(board => 
      board.type === type || board.type === 'both'
    );
  }

  static async getBoardsByProvince(province: string) {
    return PAKISTANI_EDUCATION_BOARDS.filter(board => 
      board.province.toLowerCase() === province.toLowerCase()
    );
  }

  static async getBoardById(id: string) {
    return PAKISTANI_EDUCATION_BOARDS.find(board => board.id === id) || null;
  }

  static async getSubjectGroups(educationType: 'matric' | 'o_level') {
    if (educationType === 'matric') {
      return MATRIC_SUBJECT_GROUPS;
    } else {
      return O_LEVEL_SUBJECT_GROUPS;
    }
  }

  static async getGradeLevels(educationType: 'matric' | 'o_level') {
    return GRADE_LEVELS[educationType];
  }

  static async getAllSubjects(educationType: 'matric' | 'o_level') {
    const groups = await this.getSubjectGroups(educationType);
    const allSubjects = new Set<string>();
    
    groups.forEach(group => {
      group.subjects.forEach(subject => {
        allSubjects.add(subject);
      });
    });

    return Array.from(allSubjects).sort();
  }
}
