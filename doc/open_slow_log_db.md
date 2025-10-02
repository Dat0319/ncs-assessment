Để **liệt kê danh sách các câu query bị chậm** trong hệ thống, bạn cần **bật và phân tích Slow Query Log** hoặc **dùng công cụ giám sát hiệu năng truy vấn** tùy theo loại cơ sở dữ liệu bạn đang dùng.

Dưới đây là hướng dẫn cụ thể cho từng loại DB:

---

## 🐬 MySQL / MariaDB

### ✅ Bước 1: Bật Slow Query Log

```mysql
-- Bật ghi log các query chậm hơn 1 giây
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;
SET GLOBAL log_queries_not_using_indexes = 'ON'; -- tùy chọn
```

> ✅ Kiểm tra đường dẫn log:

```mysql
SHOW VARIABLES LIKE 'slow_query_log_file';
```

### ✅ Bước 2: Phân tích log bằng `mysqldumpslow`

```mysql
mysqldumpslow -s t /var/lib/mysql/your-hostname-slow.log
```

> - `-s t`: sort theo thời gian (time)
>
> - `-s c`: sort theo số lần lặp lại (count)

---

## 🐘 PostgreSQL

### ✅ Bước 1: Bật logging query chậm

Trong file `postgresql.conf`, chỉnh:

```mysql
log_min_duration_statement = 1000       # (ms) Query > 1s sẽ được log
log_statement = 'none'                  # hoặc 'all' để log mọi thứ
logging_collector = on
```

> Khởi động lại dịch vụ PostgreSQL sau khi sửa.

### ✅ Bước 2: Xem log file

File thường nằm ở:

- `/var/log/postgresql/postgresql-<version>-main.log`
- Hoặc `/usr/local/var/log/postgres.log`

---

## 🔍 Dùng công cụ `pg_stat_statements` (PostgreSQL)

### Bật extension:

```mysql
CREATE EXTENSION pg_stat_statements;
```

### Truy vấn top query chậm:

```mysql
SELECT   query,   calls,   total_time,   mean_time,   rows FROM   pg_stat_statements ORDER BY   total_time DESC LIMIT 10;
```

---

## 🎯 Gợi ý công cụ phân tích chuyên sâu

- ✅ **Percona Toolkit** cho MySQL: `pt-query-digest`
- ✅ **pgBadger** cho PostgreSQL
- ✅ **New Relic / Datadog / Prometheus + Grafana**
- ✅ **Slow Query Inspector** (GUI cho PostgreSQL)

---

## 📌 Mẹo dành cho Tech Lead

Check Mục tiêu<br>
✅ Bật slow query log ở staging/production<br>
✅ Theo dõi queries không dùng index<br>
✅ Đặt threshold phù hợp (`>500ms`, `>1s`)<br>
✅ Lưu log query vào file hoặc ELK Stack<br>
✅ Phân tích định kỳ và lên kế hoạch index<br>

---
