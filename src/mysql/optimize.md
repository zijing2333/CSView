### 慢查询的原因？<Badge text="重要" type="danger" />

![在这里插入图片描述](https://img-blog.csdnimg.cn/d3ba35cf63b44096b3766372845cf4ac.png)

### MySQL磁盘I/O很高有什么优化的方法？<Badge text="了解" type="info" />

**设置组提交的两个参数**： binlog_group_commit_sync_delay 和 binlog_group_commit_sync_no_delay_count 参数，延迟 binlog 刷盘的时机，从而减少 binlog 的刷盘次数。

::: tip 提示

这个方法是基于“额外的故意等待”来实现的，因此可能会增加语句的响应时间，但即使 MySQL 进程中途挂了，也没有丢失数据的风险，因为 binlog 早被写入到 page cache 了，只要系统没有宕机，缓存在 page cache 里的 binlog 就会被持久化到磁盘。

:::

**将 sync_binlog 设置为大于 1 的值(比较常见是 100~1000)**：表示每次提交事务都 write，但累积 N 个事务后才 fsync，相当于延迟了 binlog 刷盘的时机。但是这样做的风险是，主机掉电时会丢 N 个事务的 binlog 日志。

**将 innodb_flush_log_at_trx_commit 设置为 2**：表示每次事务提交时，都只是缓存在 redo log buffer 里的 redo log 写到 redo log 文件，注意写入到redo log 文件并不意味着写入到了磁盘，因为操作系统的文件系统中有个 Page Cache，专门用来缓存文件数据的，所以写入 redo log文件意味着写入到了操作系统的文件缓存，然后交由操作系统控制持久化到磁盘的时机。但是这样做的风险是，主机掉电的时候会丢数据。