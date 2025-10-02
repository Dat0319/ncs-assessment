
# ✅ Checklist Tối Ưu Hóa Truy Vấn SQL Cho Cơ Sở Dữ Liệu Lớn

### 1 **Thiết Kế Truy Vấn**
- [ ] Sử dụng `EXPLAIN` hoặc `EXPLAIN ANALYZE` để phân tích kế hoạch thực thi truy vấn.
- [ ] Tránh dùng `SELECT *` — chỉ chọn các cột cần thiết.
- [ ] Tách truy vấn phức tạp thành truy vấn đơn giản hoặc dùng CTE (Common Table Expressions).
- [ ] Sử dụng các cột đã đánh chỉ mục trong `WHERE`, `JOIN`, `GROUP BY`, và `ORDER BY`.
- [ ] Dùng `LIMIT` cho phân trang (hạn chế dùng `OFFSET`, ưu tiên phân trang theo key).
- [ ] Thay thế truy vấn con có liên kết bằng `JOIN` nếu có thể.

### 2 **Chiến Lược Đánh Chỉ Mục (Indexing)**
- [ ] Sử dụng **chỉ mục tổng hợp** cho các bộ lọc nhiều cột.
- [ ] Tránh đánh chỉ mục quá nhiều (làm chậm `INSERT/UPDATE/DELETE`).
- [ ] Thường xuyên theo dõi và tái tạo các chỉ mục bị phân mảnh.
- [ ] Sử dụng **chỉ mục một phần** cho các truy vấn có điều kiện cụ thể (ví dụ: trạng thái hoạt động).
- [ ] Dùng **chỉ mục bao phủ** để tránh tra cứu.

### 3 **Thiết Kế Bảng**
- [ ] Chuẩn hóa để tránh trùng lặp, sau đó phi chuẩn hóa có chiến lược để tối ưu hiệu năng.
- [ ] Phân vùng bảng lớn (theo ngày, vùng...).
- [ ] Lưu trữ dữ liệu cũ ở bảng riêng hoặc kho lưu trữ lạnh.
- [ ] Tránh bảng quá rộng (quá nhiều cột).
- [ ] Sử dụng kiểu dữ liệu phù hợp, không nên dùng kiểu quá lớn nếu không cần thiết.

### 4 **Caching & Vật Liệu Hóa (Materialization)**
- [ ] Sử dụng tầng cache (Redis, Memcached) cho truy vấn đọc nhiều.
- [ ] Vật liệu hóa kết quả tính toán phức tạp vào bảng tổng hợp.
- [ ] Cache kết quả truy vấn tại tầng ứng dụng nếu có thể.

### 5 **Tải và Tính Đồng Thời**
- [ ] Dùng connection pooling để giới hạn kết nối tới DB.
- [ ] Giới hạn truy vấn tốn tài nguyên bằng timeout hoặc circuit breaker.
- [ ] Tránh transaction kéo dài.
- [ ] Theo dõi deadlock và các khoá bị chặn.

### 6 **Bảo Trì Cơ Sở Dữ Liệu**
- [ ] Thường xuyên chạy `ANALYZE` hoặc `UPDATE STATISTICS`.
- [ ] Tái tổ chức hoặc xây dựng lại chỉ mục khi cần.
- [ ] Theo dõi slow query logs để tối ưu định kỳ.
- [ ] Xoá các bảng, cột, chỉ mục không sử dụng.

### 7 **Chiến Lược Nâng Cao**
- [ ] Dùng read replicas để chia tải đọc.
- [ ] Dùng sharding theo chiều ngang cho dữ liệu cực lớn.
- [ ] Áp dụng ghi theo lô (batch) hoặc bulk insert nếu có thể.
- [ ] Cân nhắc dùng stored procedure cho logic thường xuyên.

* * *

✅ SQL Query Optimization Checklist for Large Databases
------------------------------------------------------

### 🔍 **Query Design**

*    Use `EXPLAIN` or `EXPLAIN ANALYZE` to understand query execution plans. 
*    Avoid `SELECT *` — only select needed columns.
*    Break complex queries into simpler ones or use CTEs (Common Table Expressions).
*    Use indexed columns in `WHERE`, `JOIN`, `GROUP BY`, and `ORDER BY` clauses.
*    Use `LIMIT` with pagination (`OFFSET` carefully, or prefer keyset pagination).
*    Replace correlated subqueries with `JOIN`s when possible.

### 🗂 **Indexing Strategy**

*    Use **composite indexes** for multi-column filtering.
*    Avoid over-indexing (each index slows down `INSERT/UPDATE/DELETE`).
*    Regularly monitor and rebuild fragmented indexes.
*    Use **partial indexes** for filtered queries (e.g., on active status).
*    Use **covering indexes** to avoid lookup.

### 🧠 **Table Design**

*    Normalize to avoid duplication, then denormalize strategically for performance.
*    Partition large tables (e.g., by date or region).
*    Archive old data in separate tables or cold storage.
*    Avoid wide tables (hundreds of columns).
*    Use proper data types and avoid overly large ones (e.g., use `INT` instead of `BIGINT` if possible).

### 🔄 **Caching & Materialization**

*    Use caching layer (Redis, Memcached) for frequent reads.
*    Materialize expensive aggregates to summary tables.
*    Cache query results in app layer when possible.

### 🚦 **Concurrency and Load**

*    Use connection pooling to limit DB connections.
*    Limit expensive queries with query timeouts or circuit breakers.
*    Avoid long-running transactions.
*    Monitor locks and deadlocks.

### 🛠 **Database Maintenance**

*    Regularly run `ANALYZE` or `UPDATE STATISTICS`.
*    Rebuild or reorganize indexes as needed.
*    Monitor slow query logs and optimize regularly.
*    Clean up unused tables, indexes, or columns.

### ⚡ **Advanced Tactics**

*    Use read replicas to distribute read load.
*    Use horizontal sharding for very large datasets.
*    Apply write batching or bulk inserts when possible.
*    Consider stored procedures for frequent logic on the DB side.

* * *