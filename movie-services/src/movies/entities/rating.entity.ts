import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ratings')
export class Rating {
  @PrimaryGeneratedColumn()
  ratingId: number;

  @Column()
  userId: number;

  @Column()
  movieId: number;

  @Column('real')
  rating: number;

  @Column()
  timestamp: number;

  constructor(data?: Partial<Rating>) {
    if (data) {
      this.ratingId = data.ratingId || 0;
      this.userId = data.userId || 0;
      this.movieId = data.movieId || 0;
      this.rating = data.rating || 0;
      this.timestamp = data.timestamp || 0;
    }
  }

  // Helper methods
  getRatingDate(): Date {
    return new Date(this.timestamp * 1000); // Convert Unix timestamp to Date
  }

  getFormattedRating(): string {
    return this.rating.toFixed(1);
  }

  isValidRating(): boolean {
    return this.rating >= 0 && this.rating <= 10; // Assuming 0-10 scale
  }
}
