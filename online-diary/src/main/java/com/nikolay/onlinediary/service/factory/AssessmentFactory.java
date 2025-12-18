package com.nikolay.onlinediary.service.factory;

import com.nikolay.onlinediary.domain.Assessment;
import com.nikolay.onlinediary.dto.AssessmentDto;
import com.nikolay.onlinediary.service.time.TimeProvider;
import org.springframework.stereotype.Component;

/**
 * Factory/Builder helper for converting assessment DTOs into domain entities.
 */
@Component
public class AssessmentFactory {

    private final TimeProvider timeProvider;

    public AssessmentFactory(TimeProvider timeProvider) {
        this.timeProvider = timeProvider;
    }

    /**
     * Creates a new Assessment instance from DTO values applying default timestamps.
     */
    public Assessment createFromDto(AssessmentDto dto) {
        return builder(new Assessment()).fromDto(dto).build();
    }

    /**
     * Applies DTO values to an existing Assessment instance.
     */
    public Assessment applyDto(AssessmentDto dto, Assessment target) {
        return builder(target).fromDto(dto).build();
    }

    private AssessmentBuilder builder(Assessment target) {
        return new AssessmentBuilder(target, timeProvider);
    }

    private static final class AssessmentBuilder {
        private final Assessment target;
        private final TimeProvider timeProvider;

        AssessmentBuilder(Assessment target, TimeProvider timeProvider) {
            this.target = target;
            this.timeProvider = timeProvider;
        }

        AssessmentBuilder fromDto(AssessmentDto dto) {
            target.setSubmissionId(dto.getSubmissionId());
            target.setTeacherId(dto.getTeacherId());
            target.setGrade(dto.getGrade());
            target.setCommentText(dto.getCommentText());
            target.setAssessedAt(dto.getAssessedAt());
            return this;
        }

        Assessment build() {
            if (target.getAssessedAt() == null) {
                target.setAssessedAt(timeProvider.now());
            }
            return target;
        }
    }
}
