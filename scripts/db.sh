#!/bin/bash

# Database Management Script
echo "💾 Database Management Tools"
echo ""

DB_DIR="./db"
BACKUP_DIR="./backups"

# Create backups directory if it doesn't exist
mkdir -p $BACKUP_DIR

case "$1" in
    "check"|"status")
        echo "📊 Database Status:"
        echo ""
        if [ -f "$DB_DIR/movies.db" ]; then
            echo "✅ Movies Database: $DB_DIR/movies.db"
            echo "   Size: $(du -h $DB_DIR/movies.db | cut -f1)"
            echo "   Tables:"
            sqlite3 $DB_DIR/movies.db ".tables" | sed 's/^/     - /'
        else
            echo "❌ Movies Database: NOT FOUND"
        fi
        
        echo ""
        if [ -f "$DB_DIR/ratings.db" ]; then
            echo "✅ Ratings Database: $DB_DIR/ratings.db" 
            echo "   Size: $(du -h $DB_DIR/ratings.db | cut -f1)"
            echo "   Tables:"
            sqlite3 $DB_DIR/ratings.db ".tables" | sed 's/^/     - /'
        else
            echo "❌ Ratings Database: NOT FOUND"
        fi
        ;;

    "backup")
        echo "💾 Creating database backup..."
        timestamp=$(date +"%Y%m%d_%H%M%S")
        backup_name="db_backup_$timestamp"
        
        mkdir -p "$BACKUP_DIR/$backup_name"
        cp $DB_DIR/*.db "$BACKUP_DIR/$backup_name/"
        
        echo "✅ Backup created: $BACKUP_DIR/$backup_name"
        echo "   Files backed up:"
        ls -la "$BACKUP_DIR/$backup_name/" | sed 's/^/     /'
        ;;

    "restore")
        if [ -z "$2" ]; then
            echo "❌ Usage: npm run db:restore <backup_name>"
            echo "   Available backups:"
            ls -1 $BACKUP_DIR/ 2>/dev/null | sed 's/^/     - /' || echo "     No backups found"
            exit 1
        fi
        
        backup_path="$BACKUP_DIR/$2"
        if [ -d "$backup_path" ]; then
            echo "🔄 Restoring from backup: $2"
            cp "$backup_path"/*.db $DB_DIR/
            echo "✅ Database restored from $2"
        else
            echo "❌ Backup not found: $2"
            exit 1
        fi
        ;;

    "query")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "❌ Usage: npm run db:query <movies|ratings> \"<SQL_QUERY>\""
            exit 1
        fi
        
        db_name="$2"
        query="$3"
        
        if [ "$db_name" = "movies" ]; then
            sqlite3 "$DB_DIR/movies.db" "$query"
        elif [ "$db_name" = "ratings" ]; then
            sqlite3 "$DB_DIR/ratings.db" "$query"
        else
            echo "❌ Unknown database: $db_name. Use 'movies' or 'ratings'"
            exit 1
        fi
        ;;

    "info")
        echo "📈 Database Information:"
        echo ""
        echo "Movies Database:"
        sqlite3 $DB_DIR/movies.db "SELECT COUNT(*) as movie_count FROM movies;" | sed 's/^/   Total movies: /'
        sqlite3 $DB_DIR/movies.db "SELECT COUNT(DISTINCT genres) as genre_count FROM movies WHERE genres IS NOT NULL;" | sed 's/^/   Unique genres: /'
        
        echo ""
        echo "Ratings Database:"
        sqlite3 $DB_DIR/ratings.db "SELECT COUNT(*) as rating_count FROM ratings;" | sed 's/^/   Total ratings: /'
        sqlite3 $DB_DIR/ratings.db "SELECT AVG(rating) as avg_rating FROM ratings;" | sed 's/^/   Average rating: /'
        ;;

    *)
        echo "Usage: npm run db <command> [args]"
        echo ""
        echo "Commands:"
        echo "   check     - Show database status and tables"
        echo "   backup    - Create timestamped backup"
        echo "   restore   - Restore from backup"
        echo "   query     - Run SQL query: db:query <movies|ratings> \"SELECT * FROM table\""
        echo "   info      - Show database statistics"
        echo ""
        echo "Examples:"
        echo "   npm run db check"
        echo "   npm run db backup"
        echo "   npm run db query movies \"SELECT COUNT(*) FROM movies\""
        ;;
esac